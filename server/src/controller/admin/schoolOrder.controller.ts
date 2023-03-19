import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
} from '@midwayjs/decorator';
import { Validate } from '@midwayjs/validate';
import { OrderCancelDTO, OrderDeliverDTO } from '../../dto/order.dto';
import {
  AdminOrderSchoolListDTO,
  AdminOrderSchoolTakerDTO,
  SchoolOrderCapitalTrendListDTO,
  SchoolOrderOneClickhandleDTO,
} from '../../dto/orderSchool.dto';
import { DefaultError } from '../../error/default.error';
import { AdminMiddleware } from '../../middleware/admin.middleware';
import { QueryService } from '../../service/query.service';
import { SchoolService } from '../../service/school.service';
import { SchoolOrdersService } from '../../service/schoolOrders.service';
import { TakerService } from '../../service/taker.service';
import { UserService } from '../../service/user.service';
import { ORDER_COMPLETE_DELAY } from '../../task/schoolOrder.task';
import { BaseController } from '../base.controller';

@Controller('/admin/school/order', { middleware: [AdminMiddleware] })
export class SchoolOrderController extends BaseController {
  @Inject()
  orderService: SchoolOrdersService;

  @Inject()
  queryService: QueryService;

  @Inject()
  userService: UserService;

  @Inject()
  schoolService: SchoolService;

  @Inject()
  takerService: TakerService;

  @Get('/list')
  @Validate()
  async list(@Query() dto: AdminOrderSchoolListDTO) {
    const orderTable = this.orderService.schoolOrdersEntity.metadata.tableName;
    const userTable = this.userService.userModel.metadata.tableName;
    let wheres = ` ot.userNo = ut.userNo`;

    if (dto.orderNo) {
      wheres += ` and ot.orderNo = '${dto.orderNo}'`;
    }
    if (dto.orderType) {
      wheres += ` and ot.orderType = '${dto.orderType}'`;
    }
    if (dto.status) {
      wheres += ` and ot.status = ${dto.status}`;
    }
    if (dto.userNo) {
      wheres += ` and ot.userNo = '${dto.userNo}'`;
    }
    if (dto.intoHall !== undefined) {
      wheres += ` and ot.intoHall = ${dto.intoHall}`;
    }
    const result = await this.queryService.select(
      this.orderService.schoolOrdersEntity,
      {
        tables: `${orderTable} ot , ${userTable} ut`,
        wheres,
        fields: 'ot.*, ut.nickName, ut.avatarUrl',
        current: dto.current,
        pageSize: dto.pageSize,
        order: 'ot.createTime desc',
      }
    );
    this.schoolOrderListFilter(result);
    return this.responseSuccess('ok', result);
  }

  @Post('/cancel')
  @Validate()
  async cancel(@Body() dto: OrderCancelDTO) {
    if (this.ctx.adminInfo.isDemo) {
      throw new DefaultError('演示账户无权限操作');
    }
    await this.orderService.cancelOrder(
      dto,
      'admin',
      this.ctx.adminInfo.adminNo
    );
    return this.responseSuccess('订单已取消');
  }

  @Post('/complete')
  @Validate()
  async complete(@Body() dto: OrderDeliverDTO) {
    if (this.ctx.adminInfo.isDemo) {
      throw new DefaultError('演示账户无权限操作');
    }
    await this.orderService.clickComplete(
      dto.orderNo,
      'admin',
      this.ctx.adminInfo.adminNo
    );
    return this.responseSuccess('订单完成');
  }

  /**
   * 资金走向列表
   */
  @Get('/capitaltrend/list')
  @Validate()
  async capitalTrendList(@Query() dto: SchoolOrderCapitalTrendListDTO) {
    let wheres = '';

    if (dto.desc) {
      wheres = `${wheres ? ' and ' : ''} bs.desc like "%${dto.desc}%"`;
    }
    if (dto.orderNo) {
      wheres = `${wheres ? ' and ' : ''} bs.orderNo like "%${dto.orderNo}%"`;
    }
    if (dto.takerNo) {
      wheres = `${wheres ? ' and ' : ''} bs.takerNo = "${dto.takerNo}"`;
    }
    const result = await this.queryService.select(
      this.orderService.schoolOrdersEntity,
      {
        tables: `${this.orderService.balanceSheet.balanceSheet.metadata.tableName} bs`,
        wheres,
        order: 'bs.createTime desc',
        current: dto.current,
        pageSize: dto.pageSize,
      }
    );

    return this.responseSuccess('ok', result);
  }

  /**
   * 一键处理订单
   */
  @Post('/handle')
  @Validate()
  async oneClickHandle(@Body() dto: SchoolOrderOneClickhandleDTO) {
    let waitPay = 0;
    if (dto.waitPayAutoCanel) {
      const result = await this.orderService.schoolOrdersEntity.find({
        where:
          'status=0 and UNIX_TIMESTAMP(createTime) + 15*60 <= UNIX_TIMESTAMP(now())',
      });
      for (const item of result) {
        const res = await this.orderService.closeOrder(item.orderNo);
        if (res) {
          waitPay++;
        }
      }
    }
    let autoCompete = 0;
    if (dto.autoCompete) {
      const result = await this.orderService.schoolOrdersEntity.find({
        where: ` status=3 and UNIX_TIMESTAMP(getTime) + ${
          ORDER_COMPLETE_DELAY / 1000
        } <= UNIX_TIMESTAMP(now())`,
      });
      for (const item of result) {
        const res = await this.orderService.clickComplete(
          item.orderNo,
          'admin',
          this.ctx.adminInfo.adminNo
        );
        if (res) {
          autoCompete++;
        }
      }
    }
    let autoCancel = 0;
    if (dto.deadlineAutoCancel) {
      const result = await this.orderService.schoolOrdersEntity.find({
        where: ` status=1 and deadlineTime  <= ${Date.now()}`,
      });
      for (const item of result) {
        const res = await this.orderService.cancelOrder(
          {
            orderNo: item.orderNo,
            cancelReason: '到达截止时间未接单,一键取消',
          },
          'admin',
          this.ctx.adminInfo.adminNo
        );
        if (res) {
          autoCancel++;
        }
      }
    }

    return this.responseSuccess('ok', { waitPay, autoCompete, autoCancel });
  }

  @Post('/take')
  @Validate()
  async take(@Body() dto: AdminOrderSchoolTakerDTO) {
    const taker = await this.takerService.takerEntity.findOne({
      where: { takerNo: dto.takerNo },
    });
    const result = await this.orderService.takeOrder(dto.orderNo, taker.userNo);
    if (!result) {
      throw new DefaultError('接单失败');
    }

    return this.responseSuccess('成功接单');
  }
}
