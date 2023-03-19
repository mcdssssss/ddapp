import { Inject, Provide, Queue } from '@midwayjs/decorator';
import { SchoolOrdersService } from '../service/schoolOrders.service';

// 自动关闭时间
export const ORDER_CLOSE_DELAY = 15 * 60 * 1000;
// 自动完成时间
export const ORDER_COMPLETE_DELAY = 2 * 60 * 60 * 1000;
// 自动取消时间
export const ORDER_CANCEL_DELAY = 2 * 60 * 60 * 1000;

/**
 * 待付款的订单自动关闭
 */

@Queue()
@Provide()
export class SchoolOrderWaitPayToCloseTask {
  @Inject()
  schoolOrdersService: SchoolOrdersService;

  async execute(params: { orderNo: string }) {
    try {
      await this.schoolOrdersService.closeOrder(params.orderNo);
    } catch (error) {
      console.error(error);
    }
  }
}

/**
 * 订单自动完成
 */
@Queue()
@Provide()
export class SchoolOrderAutoToCompleteTask {
  @Inject()
  schoolOrdersService: SchoolOrdersService;

  async execute(params: { orderNo: string }) {
    console.info(`[ task ] 订单${params.orderNo} 自动完成 开始...`);

    await this.schoolOrdersService.clickComplete(
      params.orderNo,
      'system',
      undefined
    );
  }
}

/**
 * 超过截止时间未接单自动取消
 */
@Queue()
@Provide()
export class SchoolOrderAutoCancelByDealineTask {
  @Inject()
  schoolOrdersService: SchoolOrdersService;
  async execute(params: { orderNo: string }) {
    await this.schoolOrdersService.cancelOrder(
      {
        orderNo: params.orderNo,
        cancelReason: '订单截止时间内未接单,系统自动取消',
      },
      'system',
      undefined
    );
  }
}
