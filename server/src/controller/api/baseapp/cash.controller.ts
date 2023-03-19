import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
} from '@midwayjs/decorator';
import { Validate } from '@midwayjs/validate';
import { CashRegisterDTO } from '../../../dto/cash.dto';
import { SelectCommonDTO } from '../../../dto/common.dto';
import { DefaultError } from '../../../error/default.error';
import { AppMiddleware } from '../../../middleware/app.middleware';
import { CashService } from '../../../service/cash.service';
import { QueryService } from '../../../service/query.service';
import { TakerService } from '../../../service/taker.service';
import { BaseController } from '../../base.controller';

@Controller('/api/baseapp/cash', { middleware: [AppMiddleware] })
export class BaseappCashController extends BaseController {
  @Inject()
  cashService: CashService;

  @Inject()
  queryService: QueryService;

  @Inject()
  takerService: TakerService;
  /**
   * 申请提现
   * @param dto
   * @returns
   */
  @Post('/register')
  @Validate()
  async register(@Body() dto: CashRegisterDTO) {
    const { canICash, takerNo } = await this.cashService.canICashByTaker(
      dto.amount
    );
    if (!canICash) {
      throw new DefaultError('提现金额大于超出账户余额，不可提现');
    }
    const res = await this.cashService.cashEntity.insert({
      cashBy: 'taker',
      cashByNo: takerNo,
      status: 0,
      amount: dto.amount,
      bankNo: dto.bankNo,
      cashNo: this.nanoid(16),
    });
    if (!res.raw.insertId) {
      throw new DefaultError('申请提现失败');
    }
    return this.responseSuccess('提现申请已提交');
  }

  /**
   * 余额
   * @returns
   */
  @Get('/blance')
  async getBlanceAmount() {
    const { totalAmount } = await this.cashService.canICashByTaker(100);
    return this.responseSuccess(
      'ok',
      Math.floor(Math.round(totalAmount * 100)) / 100
    );
  }

  @Get('/list')
  @Validate()
  async list(@Query() dto: SelectCommonDTO) {
    const taker = await this.takerService.checkTaker(this.ctx.userInfo.userNo);
    const result = await this.queryService.select(this.cashService.cashEntity, {
      tables: this.cashService.getTableName(),
      wheres: `cashBy='taker' and cashByNo='${taker.takerNo}'`,
      current: dto.current,
      pageSize: dto.pageSize,
      order: 'createTime desc',
    });
    return this.responseSuccess('ok', result);
  }
}
