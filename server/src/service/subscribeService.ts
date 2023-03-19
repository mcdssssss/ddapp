import { Inject, Provide } from '@midwayjs/decorator';
import { WXAPP_SUBSCRIBE_SCHOOL } from '../constant';
import { ConfigSubscribeDTO } from '../dto/config.dto';
import { SchoolOrdersEntity } from '../entity/schoolOrders.entity';
import { TakerEntity } from '../entity/taker.entity';
import { BaseService } from './base.service';
import { ConfigService } from './config.service';
import dayjs = require('dayjs');
import { WxSubscribeMessageService } from './wx/subscribeMessage.service';

@Provide()
export class SubscribeService extends BaseService {
  @Inject()
  configService: ConfigService;

  @Inject()
  wxsubscribeService: WxSubscribeMessageService;

  /**
   * 订单订阅消息
   */
  async sendSubscribeByOrder(
    order: SchoolOrdersEntity,
    type: string,
    { taker }: { taker?: TakerEntity }
  ) {
    // 发送订阅消息
    if (order.fromClient.provider === 'weixin' && order.fromClient.openid) {
      this.wxSubscribeSend(order, type, { taker });
    }
  }

  /**
   * 接单注册订阅消息
   * 审核结果、备注、审核状态、审核时间
   */
  async sendSubscribeByRegisterTaker(taker: TakerEntity) {
    // 发送订阅消息
    if (taker.fromClient.provider === 'weixin' && taker.fromClient.openid) {
      this.wxSubscribeSendVerify(taker);
    }
  }

  async wxSubscribeSend(
    order: SchoolOrdersEntity,
    type: string,
    { taker }: { taker?: TakerEntity }
  ) {
    const configName = WXAPP_SUBSCRIBE_SCHOOL;
    const config = (await this.configService.getConfig(
      configName,
      false
    )) as ConfigSubscribeDTO;
    if (!config) {
      return;
    }
    // 接单
    if (
      type === 'receive' &&
      config.orderReceive &&
      config.orderReceiveKeys.length === 4
    ) {
      const data = {} as any;
      // 订单号、操作人、操作时间、订单金额
      data[config.orderReceiveKeys[0]] = {
        value: order.orderNo,
      };
      data[config.orderReceiveKeys[1]] = {
        value: taker.realName,
      };
      data[config.orderReceiveKeys[2]] = {
        value: dayjs(new Date()).format('YYYY/MM/DD HH:mm'),
      };
      data[config.orderReceiveKeys[3]] = {
        value: this.filterNumber(order.totalPrice),
      };
      this.wxsubscribeService.send({
        touser: order.fromClient.openid,
        template_id: config.orderReceive,
        page: '/pages/order/detail?orderNo=' + order.orderNo,
        data,
      });
    } else if (
      type === 'complete' &&
      config.orderComplete &&
      config.orderCompleteKeys.length === 5
    ) {
      const data = {} as any;
      // 订单号、订单类型、订单状态、完成时间、内容
      data[config.orderCompleteKeys[0]] = {
        value: order.orderNo,
      };
      data[config.orderCompleteKeys[1]] = {
        value: order.priceDetails.subTitle,
      };
      data[config.orderCompleteKeys[2]] = { value: '已完成' };
      data[config.orderCompleteKeys[3]] = {
        value: dayjs(new Date()).format('YYYY/MM/DD HH:mm'),
      };
      data[config.orderCompleteKeys[4]] = { value: order.priceDetails.desc };

      this.wxsubscribeService.send({
        touser: order.fromClient.openid,
        template_id: config.orderComplete,
        page: '/pages/order/detail?orderNo=' + order.orderNo,
        data,
      });
    } else if (
      type === 'cancel' &&
      config.orderCancel &&
      config.orderCancelKeys.length === 5
    ) {
      const data = {} as any;
      // 订单号、订单状态、订单类型、取消理由、取消时间
      data[config.orderCancelKeys[0]] = { value: order.orderNo };
      data[config.orderCancelKeys[1]] = { value: '已完成' };
      data[config.orderCancelKeys[2]] = { value: order.priceDetails.subTitle };
      data[config.orderCancelKeys[3]] = {
        value: order.cancelReason || '无理由',
      };
      data[config.orderCancelKeys[4]] = {
        value: dayjs(new Date()).format('YYYY/MM/DD HH:mm'),
      };

      this.wxsubscribeService.send({
        touser: order.fromClient.openid,
        template_id: config.orderCancel,
        page: '/pages/order/detail?orderNo=' + order.orderNo,
        data,
      });
    }
  }

  async wxSubscribeSendVerify(taker: TakerEntity) {
    const configName = WXAPP_SUBSCRIBE_SCHOOL;
    const config = (await this.configService.getConfig(
      configName,
      false
    )) as ConfigSubscribeDTO;
    if (!config) {
      return;
    }
    // 接单
    if (config.verifyResult && config.verifyResultKeys.length === 4) {
      const data = {} as any;
      // 审核结果、备注、审核状态、审核时间
      data[config.verifyResultKeys[0]] = {
        value: taker.status === 1 ? '通过审核' : '审核不通过',
      };
      data[config.verifyResultKeys[1]] = {
        value: taker.status === 1 ? '前往接单吧' : taker.refuseMsg,
      };
      data[config.verifyResultKeys[2]] = {
        value: taker.status === 1 ? '已通过' : '未通过',
      };
      data[config.verifyResultKeys[3]] = {
        value: dayjs(new Date()).format('YYYY/MM/DD HH:mm'),
      };

      this.wxsubscribeService.send({
        touser: taker.fromClient.openid,
        template_id: config.verifyResult,
        page: '/pages/mine/taker/status',
        data,
      });
    }
  }
}
