import { Inject, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { EntityManager, Repository } from 'typeorm';
import { OrderCancelDTO } from '../dto/order.dto';
import {
  SchoolAddress,
  SchoolOrdersEntity,
} from '../entity/schoolOrders.entity';
import { DefaultError } from '../error/default.error';
import { OrderType, SchoolOrderPersonType } from '../interface';
import { BaseService } from './base.service';
import { SchoolService } from './school.service';
import { SchoolBalanceSheetService } from './schoolBalanceSheet.service';
import { TakerService } from './taker.service';
import { UserService } from './user.service';
import { WxappService } from './wxapp.service';
import { ConfigService } from './config.service';
import { WxService } from './wx.service';
import { AppMchDTO } from '../dto/config.dto';
import { QueueService } from '@midwayjs/task';
import {
  ORDER_COMPLETE_DELAY,
  SchoolOrderAutoCancelByDealineTask,
  SchoolOrderAutoToCompleteTask,
} from '../task/schoolOrder.task';
import { SubscribeService } from './subscribeService';
// const env = process.env.NODE_ENV;
// const config = require(`../config/config.${env}`).default;

@Provide()
export class SchoolOrdersService extends BaseService {
  @InjectEntityModel(SchoolOrdersEntity)
  schoolOrdersEntity: Repository<SchoolOrdersEntity>;

  @Inject()
  takerService: TakerService;

  @Inject()
  balanceSheet: SchoolBalanceSheetService;

  @Inject()
  schoolService: SchoolService;

  @Inject()
  userService: UserService;

  @Inject()
  wxappService: WxappService;

  @Inject()
  configService: ConfigService;

  @Inject()
  wxService: WxService;

  @Inject()
  queueService: QueueService;

  @Inject()
  subscribeService: SubscribeService;

  getTableName() {
    return this.schoolOrdersEntity.metadata.tableName;
  }

  async wxPayCallback(orderNo: string, payType: 'wxpay' | 'alipay') {
    const order = await this.schoolOrdersEntity.findOne({
      where: { orderNo },
    });

    const update = await this.schoolOrdersEntity.update(
      {
        orderNo,
        status: 0,
      },
      {
        status: 1,
        payTime: new Date(),
        payType,
      }
    );
    if (update.affected === 0) {
      throw new DefaultError('更新订单失败');
    }
    // 超过截止时间自动取消订单
    const delay = parseInt(order.deadlineTime + '') - Date.now();
    // console.log
    if (delay > 0) {
      await this.queueService.execute(
        SchoolOrderAutoCancelByDealineTask,
        { orderNo: order.orderNo },
        { delay }
      );
    }

    return true;
  }

  async doPay(orderNo: string, totalPrice: number, desc: string) {
    let returnParams = {} as any;
    const userType = this.ctx.userInfo.userType;
    if (userType === 'weixin') {
      // 调起支付
      const pay = await this.wxappService.payUnifiedorder(
        orderNo,
        totalPrice,
        desc
      );
      if (pay.return_code[0] !== 'SUCCESS') {
        throw new DefaultError(pay.return_msg[0]);
      }
      const { appMch } = this.wxService.getVersionInfo();
      const mch = (await this.configService.getConfig(appMch)) as AppMchDTO;
      const timeStamp = Date.now() + '';
      const paySign = this.wxService.paysign2(
        pay.appid[0],
        timeStamp,
        pay.nonce_str[0],
        'prepay_id=' + pay.prepay_id[0],
        mch.wxMchSecert
      );
      returnParams = {
        orderNo: orderNo,
        nonce_str: pay.nonce_str[0],
        sign: pay.sign[0],
        paySign,
        timeStamp,
        prepay_id: pay.prepay_id[0],
        trade_type: pay.trade_type[0],
      };
    } else {
      returnParams = {
        orderNo,
      };
    }
    return returnParams;
  }

  async checkOrder(orderNo: string, status: OrderType | OrderType[]) {
    const order = await this.schoolOrdersEntity.findOne({
      where: { orderNo },
    });
    if (!order) {
      throw new DefaultError('订单不存在');
    }
    if (typeof status === 'number') {
      if (order.status !== status) {
        throw new DefaultError('订单状态有误');
      }
    } else {
      let isSimple = false;
      for (const item of status) {
        if (item === order.status) {
          isSimple = true;
        }
      }
      if (!isSimple) {
        throw new DefaultError('订单状态有误');
      }
    }
    return order;
  }

  /**
   * 接单
   */
  async takeOrder(orderNo: string, userNo: string) {
    return await this.schoolOrdersEntity.manager.transaction(
      async (entity: EntityManager) => {
        const taker = await this.takerService.checkTaker(userNo);
        const order = await this.checkOrder(orderNo, 1);
        const orderUpdate = await entity.update(
          this.schoolOrdersEntity.target,
          {
            orderNo: order.orderNo,
            status: 1,
          },
          {
            takerNo: taker.takerNo,
            status: 2,
            sendTime: new Date(),
          }
        );
        if (orderUpdate.affected === 0) {
          throw new DefaultError('接单失败');
        }
        // 发送订阅消息
        this.subscribeService.sendSubscribeByOrder(order, 'receive', { taker });

        return true;
      }
    );
  }

  /**
   * 点击配送完成
   */
  async clickSendComplete(orderNo: string, userNo: string) {
    return await this.schoolOrdersEntity.manager.transaction(
      async (entity: EntityManager) => {
        const order = await this.checkOrder(orderNo, 2);
        const taker = await this.takerService.checkTaker(userNo);
        if (order.takerNo !== taker.takerNo) {
          throw new DefaultError('您无权操作别人的订单');
        }
        const update = await entity.update(
          this.schoolOrdersEntity.target,
          {
            orderNo: order.orderNo,
            status: 2,
          },
          {
            status: 3,
            getTime: new Date(),
          }
        );
        if (update.affected === 0) {
          throw new DefaultError('操作失败');
        }
        await this.queueService.execute(
          SchoolOrderAutoToCompleteTask,
          { orderNo },
          { delay: ORDER_COMPLETE_DELAY }
        );
        // 发送订阅消息
        this.subscribeService.sendSubscribeByOrder(order, 'complete', {});
        return true;
      }
    );
  }

  /**
   * 点击完成
   * @param orderNo
   * @param completeBy
   * @param completeByNo
   * @returns
   */
  async clickComplete(
    orderNo: string,
    completeBy: SchoolOrderPersonType,
    completeByNo?: string
  ) {
    const order = await this.checkOrder(orderNo, 3);
    if (completeBy === 'taker') {
      const taker = await this.takerService.checkTaker(completeByNo);
      if (order.takerNo !== taker.takerNo) {
        throw new DefaultError('您无权操作别人的订单');
      }
    }
    const update = await this.schoolOrdersEntity.update(
      {
        orderNo: order.orderNo,
        status: 3,
      },
      {
        status: 4,
        successTime: new Date(),
        completeBy,
        completeByNo,
      }
    );
    if (update.affected === 0) {
      throw new DefaultError('操作失败');
    }

    // 资产分割
    await this.balanceSheet.subAssets(order);

    return true;
  }

  async closeOrder(orderNo: string) {
    return await this.schoolOrdersEntity.manager.transaction(
      async (entity: EntityManager) => {
        const order = await this.checkOrder(orderNo, 0);
        const update = await entity.update(
          this.schoolOrdersEntity.target,
          {
            orderNo: order.orderNo,
          },
          {
            status: -1,
            closeTime: new Date(),
          }
        );
        if (update.affected === 0) {
          throw new DefaultError('操作失败');
        }

        return true;
      }
    );
  }

  /**
   * 取消订单
   * @param dto
   * @param cancelBy
   * @param cancelByNo
   * @returns
   */
  async cancelOrder(
    dto: OrderCancelDTO,
    cancelBy: SchoolOrderPersonType,
    cancelByNo?: string
  ) {
    const order = await this.checkOrder(dto.orderNo, [0, 1, 2]);
    const update = await this.schoolOrdersEntity.update(
      {
        orderNo: order.orderNo,
      },
      {
        status: -2,
        cancelTime: new Date(),
        cancelBy,
        cancelByNo,
        cancelReason: dto.cancelReason,
      }
    );
    if (update.affected === 0) {
      throw new DefaultError('订单取消失败');
    }
    // 退款
    await this.refundOrder(order);

    // 发送订阅消息
    this.subscribeService.sendSubscribeByOrder(order, 'cancel', {});
    // 发送小票信息给商家
    if (order.orderType === 'shop' && order.status > 0) {
      const {
        PluginShopService,
      } = require('../plugins/shop/service/pluginShop.service');
      const shopService = (await this.ctx.requestContext.getAsync(
        PluginShopService
      )) as any;
      shopService.cancelOrder(order);
    }
    return true;
  }

  /**
   * 退款
   * @param order
   * @param cancelBy
   */
  async refundOrder(order: SchoolOrdersEntity) {
    if (order.status === 1 || order.status === 2) {
      const refundFee = order.totalPrice;

      /** 以下执行申请退款 */
      // 退款 refundFee
      if (refundFee > 0 && order.payType === 'wxpay') {
        await this.wxappService.refund(
          order.orderNo,
          order.totalPrice,
          refundFee,
          order.cancelReason || '无理由取消'
        );
      }
      /** 以上执行申请退款 */

      return refundFee;
    }
  }

  // 订单信息加密
  orderEncryption(order: SchoolOrdersEntity) {
    this.addressEncryption(order.startAddress);
    this.addressEncryption(order.endAddress);
    if (order.priceDetails) {
      if (order.orderType === 'errands') {
        order.priceDetails.desc = this.descEncryption(order.priceDetails.desc);
        if ((order.priceDetails as any).image) {
          (order.priceDetails as any).image = '';
        }
        if ((order.priceDetails as any).images) {
          (order.priceDetails as any).images = [];
        }
      } else if (order.orderType === 'express') {
        order.priceDetails.desc = this.descEncryption(order.priceDetails.desc);
      }
    }
  }

  // 地址信息加密
  addressEncryption(address: SchoolAddress) {
    if (address) {
      if (address.mobileNumber) {
        address.mobileNumber = this.userService.getUnshowMobile(
          address.mobileNumber
        );
      }
      if (address.contactName) {
        address.contactName = this.userService.getUnshowName(
          address.contactName
        );
      }
      if (address.detail) {
        address.detail = '****';
      }

      if (address.schoolBuild) {
        if (address.schoolBuild.detail) {
          address.schoolBuild.detail = '****';
        }
      }
    }
  }

  // 文本里的数字信息加密
  descEncryption(desc: string) {
    return desc.replace(/[0-9]/gi, '*');
  }
}
