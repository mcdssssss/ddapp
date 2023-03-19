import { Body, Controller, Inject, Post } from '@midwayjs/decorator';
import { QueueService } from '@midwayjs/task';
import { Validate } from '@midwayjs/validate';
import { OrderSchoolInfoDTO } from '../../../dto/orderSchool.dto';
import { PublishDTO } from '../../../dto/publish.dto';
import { DefaultError } from '../../../error/default.error';
import { OrderType, SchoolOrderStatusByMch } from '../../../interface';
import { AppMiddleware } from '../../../middleware/app.middleware';
import { PublishService } from '../../../service/publish.service';
import { SchoolOrdersService } from '../../../service/schoolOrders.service';
import {
  SchoolOrderAutoCancelByDealineTask,
  SchoolOrderWaitPayToCloseTask,
  ORDER_CLOSE_DELAY,
} from '../../../task/schoolOrder.task';
import { BaseController } from '../../base.controller';
/**
 * 发布
 */
@Controller('/api/baseapp/publish', { middleware: [AppMiddleware] })
export class PublishController extends BaseController {
  @Inject()
  publishService: PublishService;

  @Inject()
  orderService: SchoolOrdersService;

  @Inject()
  queueService: QueueService;

  @Post('/')
  @Validate()
  async publish(@Body() dto: PublishDTO) {
    const calculate = await this.publishService.calculate(dto);
    const orderNo = this.nanoid(32);
    const result = await this.publishService.schoolOrderEntity.insert(
      Object.assign(calculate, {
        userNo: this.ctx.userInfo.userNo,
        orderNo,
        status: (this.ctx.userInfo.userType === 'weixin' ||
        this.ctx.userInfo.userType === 'alipay' ||
        this.ctx.userInfo.userType === 'toutiao'
          ? 0
          : 1) as OrderType,
        deadlineTime: Date.now() + dto.deadlineTime * 60 * 60 * 1000,
        mchStatus: (calculate.orderType === 'print'
          ? 0
          : -2) as SchoolOrderStatusByMch,
        fromClient: {
          provider: this.ctx.userInfo.userType,
          openid: this.ctx.userInfo.openid || '',
          aliUserId: this.ctx.userInfo.aliUserId || '',
        },
      })
    );

    if (!result.raw.insertId) {
      throw new DefaultError('发布失败');
    }

    if (
      this.ctx.userInfo.userType === 'weixin' ||
      this.ctx.userInfo.userType === 'alipay' ||
      this.ctx.userInfo.userType === 'toutiao'
    ) {
      // 15分钟内未支付自动取消订单
      await this.queueService.execute(
        SchoolOrderWaitPayToCloseTask,
        { orderNo },
        { delay: ORDER_CLOSE_DELAY }
      );
    } else {
      // 超过截止时间自动取消订单
      await this.queueService.execute(
        SchoolOrderAutoCancelByDealineTask,
        { orderNo },
        { delay: dto.deadlineTime * 60 * 60 * 1000 }
      );
    }

    const returnParams = await this.orderService.doPay(
      orderNo,
      calculate.totalPrice,
      calculate.priceDetails.subTitle
    );
    return this.responseSuccess('发布成功', returnParams);
  }

  @Post('/payagain')
  @Validate()
  async rePublish(@Body() dto: OrderSchoolInfoDTO) {
    const order = await this.orderService.schoolOrdersEntity.findOne({
      where: dto,
    });
    if (!order) {
      throw new DefaultError('订单不存在');
    }

    return this.responseSuccess(
      'ok',
      await this.orderService.doPay(
        dto.orderNo,
        order.totalPrice,
        order.priceDetails.subTitle
      )
    );
  }

  @Post('/calculate')
  @Validate()
  async calculate(@Body() dto: PublishDTO) {
    const {
      priceDetails,
      totalPrice,
      discountDetails,
      totalDiscount,
      startAddress,
      endAddress,
    } = await this.publishService.calculate(dto);
    return this.responseSuccess('ok', {
      priceDetails,
      totalPrice,
      discountDetails,
      totalDiscount,
      startAddress,
      endAddress,
    });
  }
}
