import { Inject, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { SchoolBalanceSheetEntity } from '../entity/schoolBalanceSheet.entity';
import { SchoolOrdersEntity } from '../entity/schoolOrders.entity';
import { DefaultError } from '../error/default.error';
import { BaseService } from './base.service';
import { SchoolService } from './school.service';

@Provide()
export class SchoolBalanceSheetService extends BaseService {
  @InjectEntityModel(SchoolBalanceSheetEntity)
  balanceSheet: Repository<SchoolBalanceSheetEntity>;

  @Inject()
  schoolService: SchoolService;

  /**
   * 资产分割
   */
  async subAssets(order: SchoolOrdersEntity) {
    const service = order.priceDetails.service;
    let takerIncome = 0;
    let platformIncome = 0;
    let desc = '';
    let takerNo = '';

    takerNo = order.takerNo;
    const totalPrice = order.totalPrice + order.totalDiscount;
    platformIncome = this.filterNumber(
      service.extractForPlatform * totalPrice - order.totalDiscount
    );
    takerIncome = this.filterNumber(
      totalPrice - service.extractForPlatform * totalPrice
    );
    desc = this.getDesc(
      service.extractForPlatform,
      platformIncome,
      takerIncome
    );
    await this.addBalanceShet({
      platformIncome,
      takerIncome,
      orderNo: order.orderNo,
      takerNo,
      desc,
    });
    return true;
  }

  getDesc(
    extractForPlatform: number,
    platformIncome: number,
    takerIncome: number
  ) {
    return `平台抽取${this.filterNumber(
      extractForPlatform * 100
    )}% ${platformIncome}元;  接单员获取${this.filterNumber(
      (1 - extractForPlatform) * 100
    )}% ${takerIncome}元。`;
  }

  async addBalanceShet({
    platformIncome,
    takerIncome,
    orderNo,
    takerNo,
    desc,
  }: {
    platformIncome: number;
    takerIncome: number;
    orderNo: string;
    takerNo: string;
    desc: string;
  }) {
    const insert = await this.balanceSheet.insert({
      platformIncome,
      takerIncome,
      orderNo,
      takerNo,
      desc,
    });
    if (!insert.raw.insertId) {
      throw new DefaultError('资产分析失败');
    }
  }
}
