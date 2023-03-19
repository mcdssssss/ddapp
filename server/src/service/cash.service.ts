import { Inject, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { BanksEntity } from '../entity/banks.entity';
import { CashEntity } from '../entity/cash.entity';
import { SchoolBalanceSheetEntity } from '../entity/schoolBalanceSheet.entity';
import { BaseService } from './base.service';
import { TakerService } from './taker.service';

@Provide()
export class CashService extends BaseService {
  @InjectEntityModel(CashEntity)
  cashEntity: Repository<CashEntity>;

  @InjectEntityModel(SchoolBalanceSheetEntity)
  sbsEntity: Repository<SchoolBalanceSheetEntity>;

  @InjectEntityModel(BanksEntity)
  banksEntity: Repository<BanksEntity>;

  @Inject()
  takerService: TakerService;

  getTableName() {
    return this.cashEntity.metadata.tableName;
  }

  /**
   * 接单员提现
   * @param amount
   * @returns
   */
  async canICashByTaker(amount: number) {
    const taker = await this.takerService.checkTaker(this.ctx.userInfo.userNo);
    const totalIncomeQuery = await this.cashEntity.query(
      `select sum(takerIncome) as total from ${this.sbsEntity.metadata.tableName} where  takerNo='${taker.takerNo}' `
    );
    const totalIncome = parseFloat(totalIncomeQuery[0].total || 0);
    const totalCashQuery = await this.cashEntity.query(
      `select sum(amount) as total from ${this.cashEntity.metadata.tableName} where status in (0,1) and cashBy='taker' and cashByNo = '${taker.takerNo}'  `
    );
    const totalCash = parseFloat(totalCashQuery[0].total || 0);
    const totalAmount = this.filterNumber(totalIncome - totalCash);
    if (amount > totalAmount) {
      return { canICash: false, totalAmount };
    } else {
      return { canICash: true, totalAmount, takerNo: taker.takerNo };
    }
  }
}
