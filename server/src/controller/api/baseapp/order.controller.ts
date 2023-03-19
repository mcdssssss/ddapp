import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
} from '@midwayjs/decorator';
import { Validate } from '@midwayjs/validate';
import {
  OrderSchoolInfoDTO,
  OrderSchoolListDTO,
  OrderSchoolOrderListDTO,
} from '../../../dto/orderSchool.dto';
import { AppMiddleware } from '../../../middleware/app.middleware';
import { QueryService } from '../../../service/query.service';
import { SchoolOrdersService } from '../../../service/schoolOrders.service';
import { TakerService } from '../../../service/taker.service';
import { BaseController } from '../../base.controller';
import { filterDeadlineTime } from '../../../utils/common';
import { UserService } from '../../../service/user.service';
import { DefaultError } from '../../../error/default.error';
import { OrderCancelDTO } from '../../../dto/order.dto';
import { WxService } from '../../../service/wx.service';
import { QueueService } from '@midwayjs/task';
import { js2xml } from 'xml-js';
import { ConfigService } from '../../../service/config.service';
import { AppMchDTO, ConifgSetOrderTypeDTO } from '../../../dto/config.dto';
import { createHash, createDecipheriv } from 'crypto';
import { CONFIG_ORDERTYPE_SCHOOL } from '../../../constant';

@Controller('/api/baseapp/order')
export class OrderSchoolController extends BaseController {
  @Inject()
  orderSchoolService: SchoolOrdersService;

  @Inject()
  queryService: QueryService;

  @Inject()
  takerService: TakerService;

  @Inject()
  userService: UserService;

  @Inject()
  wxService: WxService;

  @Inject()
  queueService: QueueService;

  @Inject()
  configService: ConfigService;

  @Post('/pay/callback')
  async payCallback(@Body() body) {
    const data = ((await this.wxService.xml2JSON(body)) as any).xml;
    if (data.return_code[0] === 'SUCCESS') {
      await this.orderSchoolService.wxPayCallback(
        data.out_trade_no[0],
        'wxpay'
      );
    }
    return js2xml({
      return_code: 'SUCCESS',
      return_msg: 'OK',
    });
  }

  @Post('/refund/callback')
  async refundCallback(@Body() body) {
    const data = ((await this.wxService.xml2JSON(body)) as any).xml;
    await this.wxCallback(data);
    return js2xml({
      return_code: 'SUCCESS',
      return_msg: 'OK',
    });
  }

  async wxCallback(data: any) {
    if (data.return_code[0] === 'SUCCESS') {
      const { appMch } = this.wxService.getVersionInfo();
      const config = (await this.configService.getConfig(appMch)) as AppMchDTO;

      const md5key = createHash('md5')
        .update(config.wxMchSecert)
        .digest('hex')
        .toLowerCase();
      const decipher = createDecipheriv('aes-256-ecb', md5key, Buffer.alloc(0));
      decipher.setAutoPadding(false);
      let str = decipher.update(data.req_info[0], 'base64', 'utf8');
      str += decipher.final('utf8');
      const json = ((await this.wxService.xml2JSON(str)) as any).root;
      await this.orderSchoolService.schoolOrdersEntity.update(
        {
          orderNo: json.out_trade_no[0],
        },
        {
          status: -2,
          refundStatus: 1,
          refundNo: json.out_refund_no[0],
          refundTime: new Date(),
          refundAmount: Math.floor(parseInt(json.refund_fee[0])) / 100,
        }
      );
    }
  }

  @Post('/take', { middleware: [AppMiddleware] })
  @Validate()
  async take(@Body() dto: OrderSchoolInfoDTO) {
    const result = await this.orderSchoolService.takeOrder(
      dto.orderNo,
      this.ctx.userInfo.userNo
    );
    if (!result) {
      throw new DefaultError('接单失败');
    }

    return this.responseSuccess('成功接单');
  }

  // 送完时间
  @Post('/taker/getd', { middleware: [AppMiddleware] })
  @Validate()
  async takerGetd(@Body() dto: OrderSchoolInfoDTO) {
    const result = await this.orderSchoolService.clickSendComplete(
      dto.orderNo,
      this.ctx.userInfo.userNo
    );
    if (!result) {
      throw new DefaultError('操作失败');
    }
    return this.responseSuccess('操作成功');
  }

  @Post('/taker/complete', { middleware: [AppMiddleware] })
  @Validate()
  async takerComplete(@Body() dto: OrderSchoolInfoDTO) {
    const result = await this.orderSchoolService.clickComplete(
      dto.orderNo,
      'taker',
      this.ctx.userInfo.userNo
    );
    if (!result) {
      throw new DefaultError('操作失败');
    }
    return this.responseSuccess('操作成功');
  }

  @Post('/complete', { middleware: [AppMiddleware] })
  @Validate()
  async userComplete(@Body() dto: OrderSchoolInfoDTO) {
    const result = await this.orderSchoolService.clickComplete(
      dto.orderNo,
      'user',
      this.ctx.userInfo.userNo
    );
    if (!result) {
      throw new DefaultError('操作失败');
    }
    return this.responseSuccess('操作成功');
  }

  @Post('/cancel', { middleware: [AppMiddleware] })
  async userCancel(@Body() dto: OrderCancelDTO) {
    const result = await this.orderSchoolService.cancelOrder(
      dto,
      'user',
      this.ctx.userInfo.userNo
    );
    if (!result) {
      throw new DefaultError('操作失败');
    }
    return this.responseSuccess('操作成功');
  }

  @Post('/taker/cancel', { middleware: [AppMiddleware] })
  async takerCancel(@Body() dto: OrderCancelDTO) {
    const result = await this.orderSchoolService.cancelOrder(
      dto,
      'taker',
      this.ctx.userInfo.userNo
    );
    if (!result) {
      throw new DefaultError('操作失败');
    }
    return this.responseSuccess('操作成功');
  }

  @Get('/list', { middleware: [AppMiddleware] })
  @Validate()
  async list(@Query() dto: OrderSchoolListDTO) {
    const schoolTable =
      this.orderSchoolService.schoolOrdersEntity.metadata.tableName;
    const userTable = this.userService.userModel.metadata.tableName;
    let wheres = 'so.userNo=u.userNo ';
    if (dto.orderType === 'taker') {
      const taker = await this.takerService.checkTaker(
        this.ctx.userInfo.userNo
      );
      wheres += ` and so.takerNo='${taker.takerNo}'`;
    } else {
      wheres += ` and so.userNo='${this.ctx.userInfo.userNo}'`;
    }

    if (dto.status === 'waitPay') {
      wheres += ' and so.status=0';
    } else if (dto.status === 'waitTake') {
      wheres += ' and so.status=1';
    } else if (dto.status === 'waitSuccess') {
      wheres += ' and so.status in (2,3)';
    } else if (dto.status === 'complete') {
      wheres += ' and so.status in (-1,-2,4)';
    }

    const result = await this.queryService.select(
      this.orderSchoolService.schoolOrdersEntity,
      {
        tables: `${schoolTable} so, ${userTable} u`,
        wheres,
        fields:
          'so.orderNo,so.startAddress,so.endAddress,so.status,so.totalPrice,u.nickName,u.avatarUrl,u.userNo,so.remarks,so.priceDetails,so.orderType,so.deadlineTime,so.createTime',
        current: dto.current,
        pageSize: dto.pageSize,
        order: 'so.createTime desc',
      }
    );
    this.schoolOrderListFilter(result);
    return this.responseSuccess('ok', result);
  }

  @Get('/school/list')
  @Validate()
  async schoolList(@Query() dto: OrderSchoolOrderListDTO) {
    const schoolTable =
      this.orderSchoolService.schoolOrdersEntity.metadata.tableName;
    const userTable = this.userService.userModel.metadata.tableName;
    const statuses = [] as number[];
    const orderConfig = (await this.configService.getConfig(
      CONFIG_ORDERTYPE_SCHOOL,
      false
    )) as ConifgSetOrderTypeDTO;
    if (orderConfig) {
      if (orderConfig.cancel) {
        statuses.push(-2);
      }
      if (orderConfig.close) {
        statuses.push(-1);
      }
      if (orderConfig.pay) {
        statuses.push(1);
      }
      if (orderConfig.take) {
        statuses.push(2);
      }
      if (orderConfig.send) {
        statuses.push(3);
      }
      if (orderConfig.complete) {
        statuses.push(4);
      }
    }
    let wheres = `so.intoHall=1 and so.userNo=u.userNo and so.status in (${
      statuses.length > 0 ? statuses.toString() : '1,2,3,4'
    })`;
    if (dto.orderType) {
      wheres += ` and so.orderType = '${dto.orderType}'`;
    }
    const result = await this.queryService.select(
      this.orderSchoolService.schoolOrdersEntity,
      {
        tables: `${schoolTable} so, ${userTable} u`,
        wheres,
        fields:
          'so.orderNo,so.startAddress,so.endAddress,so.status,so.totalPrice,u.nickName,u.avatarUrl,u.userNo,so.remarks,so.priceDetails,so.orderType,so.deadlineTime,so.createTime',
        current: dto.current,
        pageSize: dto.pageSize,
        order: 'so.createTime desc',
      }
    );

    this.schoolOrderListFilter(result);
    for (const order of result.data) {
      this.orderSchoolService.orderEncryption(order);
    }
    return this.responseSuccess('ok', result);
  }

  @Get('/info', { middleware: [AppMiddleware] })
  @Validate()
  async info(@Query() dto: OrderSchoolInfoDTO) {
    let needsEncryp = true;
    const result = await this.orderSchoolService.schoolOrdersEntity.findOne({
      where: dto,
    });
    result.deadlineTime = filterDeadlineTime(
      parseInt(result.deadlineTime.toString())
    );
    if (result.userNo) {
      const user = await this.userService.userModel.findOne({
        where: { userNo: result.userNo },
      });
      if (user) {
        (result as any).userInfo = {
          nickName: user.nickName,
          avatarUrl: user.avatarUrl,
          gender: user.gender,
        };
      }
    }
    if (result.userNo === this.ctx.userInfo.userNo) {
      needsEncryp = false;
    }
    if (result.takerNo) {
      const taker = await this.takerService.takerEntity.findOne({
        where: { takerNo: result.takerNo },
      });
      if (taker) {
        const takerUser = await this.userService.userModel.findOne({
          where: { userNo: taker.userNo },
        });
        (result as any).taker = {
          realName: taker.realName,
          nickName: takerUser.nickName,
          avatarUrl: takerUser.avatarUrl,
          mobileNumber:
            this.ctx.userInfo.userNo === result.userNo ||
            takerUser.userNo === this.ctx.userInfo.userNo
              ? takerUser.mobileNumber
              : '',
        };

        if (takerUser.userNo === this.ctx.userInfo.userNo) {
          needsEncryp = false;
        }
      }
    }

    if (needsEncryp) {
      this.orderSchoolService.orderEncryption(result);
    }
    return this.responseSuccess('ok', result);
  }
}
