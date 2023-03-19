import { Inject, Provide } from '@midwayjs/decorator';
import { QueueService } from '@midwayjs/task';

import { DefaultError } from '../error/default.error';
import { ServerType } from '../interface';
import { BaseService } from './base.service';
import { ConfigService } from './config.service';
import { MapService } from './map.service';
import { WxSubscribeMessageService } from './wx/subscribeMessage.service';
import { WxappService } from './wxapp.service';

@Provide()
export class OrderService extends BaseService {
  @Inject()
  mapService: MapService;

  @Inject()
  configService: ConfigService;

  @Inject()
  subscribeService: WxSubscribeMessageService;

  @Inject()
  wxappService: WxappService;

  @Inject()
  queueService: QueueService;

  /**
   * 计算距离
   * @param from
   * @param to
   * @returns
   */
  async calculationDistance(from: string, to: string) {
    const result = await this.mapService.batchDistanceCalculation(
      from,
      to,
      'bicycling'
    );
    if (result.rows.length > 0 && result.rows[0].elements.length > 0) {
      return result.rows[0].elements[0].distance;
    } else {
      throw new DefaultError('距离计算有误');
    }
  }

  /**
   * 获取重量标签
   * @param weight
   */
  getWeightLabel(weight: number | number[]) {
    if (typeof weight === 'number') {
      return `${weight}公斤`;
    } else if (weight[0] === 0) {
      return `${weight[1]}公斤以内`;
    } else {
      return `${weight[0]}~${weight[1]}公斤`;
    }
  }

  /**
   * 获取距离标签
   * @param distance
   */
  getDistanceLabel(distance: number) {
    if (distance >= 1000) {
      return `${Math.floor(distance / 10) / 100}公里`;
    } else {
      return `${distance}米`;
    }
  }

  /**
   * 获取服务类型标签
   * @param type
   * @returns
   */
  getServiceTypeLabel(type: ServerType): string {
    if (type === 'helpDeliver') {
      return '帮我送';
    } else if (type === 'helpGet') {
      return '帮我取';
    } else if (type === 'helpBuy') {
      return '帮我买';
    } else {
      return '' as string;
    }
  }

  /**
   * 获取订单状态标签
   * -2取消订单  -1交易关闭 0.待付款  1.已支付/待接单  2.已接单/配送中 3.配送完成/待确认  4.确认完成'
   */
  getOrderStatus(status: number): string {
    switch (status) {
      case -2:
        return '订单已取消';
      case -1:
        return '订单已关闭';
      case 0:
        return '待付款';
      case 1:
        return '等待接单';
      case 2:
        return '订单正在配送';
      case 3:
        return '等待确认';
      case 4:
        return '订单已完成';
    }
  }
}
