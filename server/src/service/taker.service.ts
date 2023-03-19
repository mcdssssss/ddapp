import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import {
  InsertResult,
  QueryFailedError,
  Repository,
  UpdateResult,
} from 'typeorm';
import { TakerAddDTO } from '../dto/taker.dto';
import { CashEntity } from '../entity/cash.entity';
import { SchoolBalanceSheetEntity } from '../entity/schoolBalanceSheet.entity';
import { TakerEntity } from '../entity/taker.entity';
import { DefaultError } from '../error/default.error';
import { TakerError } from '../error/taker.error';
import { BaseService } from './base.service';

@Provide()
export class TakerService extends BaseService {
  @InjectEntityModel(TakerEntity)
  takerEntity: Repository<TakerEntity>;

  @InjectEntityModel(SchoolBalanceSheetEntity)
  bsEntity: Repository<SchoolBalanceSheetEntity>;

  @InjectEntityModel(CashEntity)
  cashEntity: Repository<CashEntity>;

  getTableName() {
    return this.takerEntity.metadata.tableName;
  }

  async checkTaker(userNo: string) {
    const result = await this.takerEntity.findOne({
      where: {
        userNo,
      },
    });
    if (!result) {
      throw new TakerError('您还不是接单员');
    }
    if (result.status === 0) {
      throw new TakerError('您的申请还在审核中');
    } else if (result.status === -1) {
      throw new TakerError('您还不是接单员');
    }
    return result;
  }

  async add(userNo: string, status: 0 | 1, addDto: TakerAddDTO) {
    await this.takerEntity
      .insert(
        Object.assign(addDto, {
          takerNo: this.nanoid(16),
          userNo,
          status,
          fromClient: {
            provider: this.ctx.userInfo.userType,
            openid: this.ctx.userInfo.openid || '',
            aliUserId: this.ctx.userInfo.aliUserId || '',
          },
        })
      )
      .catch(async (err: QueryFailedError) => {
        if (err.driverError.errno === 1062) {
          throw new DefaultError('接单员已注册');
        } else {
          throw new DefaultError('注册接单员异常');
        }
      })
      .then(async (result: InsertResult) => {
        if (!result.raw.insertId) {
          throw new DefaultError('注册接单员失败');
        }
      });
  }

  async update(userNo: string, status: 0 | 1, addDto: TakerAddDTO) {
    await this.takerEntity
      .update(
        {
          userNo,
        },
        Object.assign(addDto, {
          status,
          fromClient: {
            provider: this.ctx.userInfo.userType,
            openid: this.ctx.userInfo.openid || '',
            aliUserId: this.ctx.userInfo.aliUserId || '',
          },
        })
      )
      .catch(async (err: QueryFailedError) => {
        if (err.driverError.errno === 1062) {
          throw new DefaultError('接单员已注册');
        } else {
          throw new DefaultError('注册接单员异常');
        }
      })
      .then(async (result: UpdateResult) => {
        if (result.affected === 0) {
          throw new DefaultError('注册接单员失败');
        }
      });
  }

  async getCapital(takerNo: string) {
    const bs = await this.bsEntity.query(
      `select sum(takerIncome) as income from ${this.bsEntity.metadata.tableName} where takerNo='${takerNo}'`
    );
    if (bs.length === 0) {
      throw new DefaultError('获取接单员收入失败');
    }
    // 累计收入
    const accumulatedIncome = Math.floor(Math.round(bs[0].income * 100)) / 100;
    let accumulatedCash = 0;
    try {
      const cash = await this.cashEntity.query(
        `select sum(amount) as total from cash where cashBy='taker' and cashByNo='${takerNo}' and status in (0,1)`
      );
      if (cash.length === 0) {
        throw new DefaultError('获取接单员提现失败');
      }
      // 累计提现
      accumulatedCash = Math.floor(Math.round(cash[0].total * 100)) / 100;
    } catch (error) {
      //
    }

    return {
      accumulatedIncome,
      accumulatedCash,
      balance:
        Math.floor(Math.round((accumulatedIncome - accumulatedCash) * 100)) /
        100,
    };
  }
}
