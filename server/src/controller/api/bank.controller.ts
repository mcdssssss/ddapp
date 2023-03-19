import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Put,
  Query,
} from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Validate } from '@midwayjs/validate';
import { Repository } from 'typeorm';
import { CONFIG_CASH, CONFIG_SETTING_CASH_SCHOOL } from '../../constant';
import { BankAddDTO, BankDelDTO, BankUpdateDTO } from '../../dto/bank.dto';
import { SelectCommonDTO } from '../../dto/common.dto';
import { ConfigCashDTO, ConfigCashSettingDTO } from '../../dto/config.dto';
import { BanksEntity } from '../../entity/banks.entity';
import { DefaultError } from '../../error/default.error';
import { AppMiddleware } from '../../middleware/app.middleware';
import { ConfigService } from '../../service/config.service';
import { QueryService } from '../../service/query.service';
import { BaseController } from '../base.controller';

// 添加银行卡
@Controller('/api/bank', { middleware: [AppMiddleware] })
export class BankController extends BaseController {
  @InjectEntityModel(BanksEntity)
  banksEntity: Repository<BanksEntity>;

  @Inject()
  queryService: QueryService;

  @Inject()
  cofigService: ConfigService;

  @Get('/verify')
  async getVerify() {
    const config = (await this.cofigService.getConfig(
      CONFIG_CASH,
      false
    )) as ConfigCashDTO;
    let canIShowInfo = false;
    if (config && config.useCash) {
      canIShowInfo = true;
    }
    return this.responseSuccess(
      'ok',
      canIShowInfo
        ? {
            title: '请完善银行卡信息',
            bankName: '请输入开户行',
            realName: '您的真实姓名',
            cardNo: '卡号',
            desc: '如果要提现到支付宝，开户行请填写“支付宝”，卡号填写支付宝账号',
            delBtn: '删除银行卡',
            navBarTitle: '银行卡',
          }
        : false
    );
  }

  @Get('/verifyinfo')
  async getVerifyInfo() {
    const config = (await this.cofigService.getConfig(
      CONFIG_SETTING_CASH_SCHOOL,
      false
    )) as ConfigCashSettingDTO;

    if (!config) {
      return this.responseSuccess('ok', false);
    }

    const bankTypes = [];
    if (config.alipay && config.alipay.open) {
      bankTypes.push({
        label: '支付宝',
        value: 'alipay',
        bankNo: '支付宝账户/手机号',
      });
    }
    if (config.bank && config.bank.open) {
      bankTypes.push({ label: '银行卡', value: 'bank', bankNo: '卡号' });
    }

    return this.responseSuccess('ok', {
      bankTypes,
      title: '请完善提现账户信息',
      bankName: '请输入开户行',
      realName: '您的真实姓名',
      cardNo: '卡号',
      desc: '填写并请仔细核对账户无误后再提交',
      delBtn: '删除提现账户',
      navBarTitle: '提现账户',
    });
  }

  @Post('/add')
  @Validate()
  async add(@Body() dto: BankAddDTO) {
    const res = await this.banksEntity.insert(
      Object.assign(dto, {
        userNo: this.ctx.userInfo.userNo,
        bankNo: this.nanoid(16),
      })
    );
    if (!res.raw.insertId) {
      throw new DefaultError('添加银行卡失败');
    }
    return this.responseSuccess('成功添加一张银行卡');
  }

  @Put('/update')
  @Validate()
  async update(@Body() dto: BankUpdateDTO) {
    const res = await this.banksEntity.update(
      {
        bankNo: dto.bankNo,
      },
      dto
    );
    if (res.affected === 0) {
      throw new DefaultError('更新银行卡失败');
    }
    return this.responseSuccess('更新银行卡成功');
  }

  @Post('/del')
  @Validate()
  async del(@Body() dto: BankDelDTO) {
    const res = await this.banksEntity.update(
      {
        bankNo: dto.bankNo,
      },
      {
        isDelete: true,
      }
    );
    if (res.affected === 0) {
      throw new DefaultError('删除银行卡失败');
    }
    return this.responseSuccess('删除银行卡成功');
  }

  @Get('/list')
  @Validate()
  async list(@Query() dto: SelectCommonDTO) {
    const result = await this.queryService.select(this.banksEntity, {
      tables: this.banksEntity.metadata.tableName,
      wheres: `isDelete=0 and userNo='${this.ctx.userInfo.userNo}' `,
      order: 'updateTime desc',
      current: dto.current,
      pageSize: dto.pageSize,
    });
    return this.responseSuccess('ok', result);
  }
}
