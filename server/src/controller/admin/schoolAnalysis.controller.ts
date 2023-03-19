import { Controller, Get, Inject, Query } from '@midwayjs/decorator';
import { Validate } from '@midwayjs/validate';
import { AnalysisDayDTO } from '../../dto/analysis.dto';
import { SchoolService } from '../../service/school.service';
import { SchoolOrdersService } from '../../service/schoolOrders.service';
import { TakerService } from '../../service/taker.service';
import { UserService } from '../../service/user.service';
import { WxappService } from '../../service/wxapp.service';
import { BaseController } from '../base.controller';
const dayjs = require('dayjs');

@Controller('/admin/school/analysis')
export class AdminSchoolAnalysisController extends BaseController {
  @Inject()
  orderService: SchoolOrdersService;

  @Inject()
  userService: UserService;

  @Inject()
  wxappService: WxappService;

  @Inject()
  schoolService: SchoolService;

  @Inject()
  takerService: TakerService;

  @Get('/total')
  async getTotalData() {
    const orderTable = this.orderService.getTableName();
    const balanceSheetTable =
      this.orderService.balanceSheet.balanceSheet.metadata.tableName;
    // 用户总数
    const userTotal = await this.userService.userModel.count({
      where: {},
    });
    // 订单完成总数
    const orderCompleteTotal = await this.orderService.schoolOrdersEntity.count(
      {
        where: {
          status: 4,
        },
      }
    );
    // 总交易额
    const tradeSumSql = `select sum(totalPrice) as value from ${orderTable} where status=4 `;
    const tradeTotal = await this.orderService.schoolOrdersEntity.query(
      tradeSumSql
    );

    // 总盈利
    const incomeTotalSql = `select sum(platformIncome) as value from ${balanceSheetTable} `;
    const incomeTotalResult = await this.orderService.schoolOrdersEntity.query(
      incomeTotalSql
    );
    const incomeTotal = incomeTotalResult[0].value;

    // 昨日日期
    const date = new Date(Date.now() - 1000 * 60 * 60 * 24);
    const dateStr = `${date.getFullYear()}${
      date.getMonth() + 1
    }${date.getDate()}`;
    // 昨日用户
    const yesterdayUserSql = `SELECT count(*) as total  FROM ${this.userService.userModel.metadata.tableName} where DATE_FORMAT(createTime, '%Y%c%e') = '${dateStr}'`;
    const yesterdayUserRes = await this.userService.userModel.query(
      yesterdayUserSql
    );

    // 昨日订单
    const yesterdayOrderCompleteSql = `SELECT count(*) as total  FROM ${orderTable} where DATE_FORMAT(createTime, '%Y%c%e') = '${dateStr}' and status = 4 `;
    const yesterdayOrderCompleteTotal =
      await this.orderService.schoolOrdersEntity.query(
        yesterdayOrderCompleteSql
      );
    // 昨日交易额
    const yesterdayTradeSumSql = `select sum(totalPrice) as value from ${orderTable} where DATE_FORMAT(createTime, '%Y%c%e') = '${dateStr}' and status=4`;
    const yesterdayTradeSum =
      await await this.orderService.schoolOrdersEntity.query(
        yesterdayTradeSumSql
      );
    // 昨日盈利
    const yesterdayIncomeTotalSql = `select sum(platformIncome) as value from ${balanceSheetTable} where DATE_FORMAT(createTime, '%Y%c%e') = '${dateStr}' `;
    const yesterdayIncomeTotalResult =
      await this.orderService.schoolOrdersEntity.query(yesterdayIncomeTotalSql);
    const yesterdayIncomeTotal = yesterdayIncomeTotalResult[0].value;

    return this.responseSuccess('ok', {
      userTotal: this.filterNumber(userTotal),
      orderCompleteTotal: this.filterNumber(orderCompleteTotal),
      tradeTotal:
        tradeTotal.length > 0 ? this.filterNumber(tradeTotal[0].value) : 0,
      incomeTotal: this.filterNumber(incomeTotal),
      yesterdayUserTotal: yesterdayUserRes[0].total,
      yesterdayOrderCompleteTotal: this.filterNumber(
        yesterdayOrderCompleteTotal[0].total
      ),
      yesterdayTradeTotal: this.filterNumber(yesterdayTradeSum[0].value),
      yesterdayIncomeTotal: this.filterNumber(yesterdayIncomeTotal),
    });
  }

  @Get('/taker')
  @Validate()
  async getTakerSort(@Query() dto: AnalysisDayDTO) {
    const sql = `SELECT sum(bs.takerIncome) as income,count(*) as total, ta.realName, u.avatarUrl
        FROM ${
          this.orderService.balanceSheet.balanceSheet.metadata.tableName
        } bs, ${this.takerService.getTableName()} ta, 
        ${this.userService.getTableName()} u  
        where ta.takerNo=bs.takerNo and u.userNo=ta.userNo  
        and date_format(bs.createTime, '%Y%m%d') between '${
          dto.beginDate
        }' and '${dto.endDate}' 
         group by bs.takerNo order by income desc limit 0,5`;
    const takerSort = await this.orderService.schoolOrdersEntity.query(sql);
    for (const item of takerSort) {
      item.income = this.filterNumber(item.income);
    }
    return this.responseSuccess('ok', takerSort);
  }

  @Get('/new/user')
  @Validate()
  async getNewUser(@Query() dto: AnalysisDayDTO) {
    const [user, wxapp] = await Promise.all([
      this.userService.userModel.query(
        this.getUserSql(dto, this.userService.getTableName())
      ),
      this.userService.userModel.query(
        this.getUserSql(dto, this.wxappService.wxappEntity.metadata.tableName)
      ),
    ]);
    const dates = this.getDate(dto, {
      value: 0,
      status: '',
    });
    const data = [];
    for (const date of dates) {
      const userVal = user.find((item: any) => item.createDate === date.date);
      data.push({
        date: date.date,
        status: '有效用户',
        value: userVal ? userVal.count : 0,
      });
      const wxVal = wxapp.find((item: any) => item.createDate === date.date);
      data.push({
        date: date.date,
        status: '微信',
        value: wxVal ? wxVal.count : 0,
      });
    }
    return this.responseSuccess('ok', data);
  }

  @Get('/new/order')
  @Validate()
  async getNewOrder(@Query() dto: AnalysisDayDTO) {
    const [cancel, close, waitReceive, complete] = await Promise.all([
      this.orderService.schoolOrdersEntity.query(
        this.getOrderSql(dto, 'cancelTime', -2)
      ),
      this.orderService.schoolOrdersEntity.query(
        this.getOrderSql(dto, 'closeTime', -1)
      ),

      this.orderService.schoolOrdersEntity.query(
        this.getOrderSql(dto, 'payTime', 1)
      ),
      this.orderService.schoolOrdersEntity.query(
        this.getOrderSql(dto, 'successTime', 4)
      ),
    ]);
    const dates = this.getDate(dto, {
      value: 0,
      status: '',
    });
    const data = [];

    for (const date of dates) {
      const cancelVal = cancel.find(
        (item: any) => item.createDate === date.date
      );
      data.push({
        date: date.date,
        status: '已取消',
        value: cancelVal ? cancelVal.count : 0,
      });

      const closeVal = close.find((item: any) => item.createDate === date.date);
      data.push({
        date: date.date,
        status: '已关闭',
        value: closeVal ? closeVal.count : 0,
      });

      const waitReceiveVal = waitReceive.find(
        (item: any) => item.createDate === date.date
      );
      data.push({
        date: date.date,
        status: '已支付',
        value: waitReceiveVal ? waitReceiveVal.count : 0,
      });

      const completeVal = complete.find(
        (item: any) => item.createDate === date.date
      );
      data.push({
        date: date.date,
        status: '已完成',
        value: completeVal ? completeVal.count : 0,
      });
    }

    return this.responseSuccess('ok', data);
  }

  getOrderSql(dto: AnalysisDayDTO, timeName: string, status: number) {
    return `select count(*) as count, date_format(${timeName}, '%Y-%m-%d') as createDate FROM ${this.orderService.getTableName()} where date_format(${timeName}, '%Y%m%d') between '${
      dto.beginDate
    }' and '${
      dto.endDate
    }' and status=${status}  group by date_format(${timeName}, '%Y-%m-%d') `;
  }

  getUserSql(dto: AnalysisDayDTO, tableName: string) {
    return `select count(*) as count, date_format(createTime, '%Y-%m-%d') as createDate FROM ${tableName} where 
     date_format(createTime, '%Y%m%d') between '${dto.beginDate}' and '${dto.endDate}'  group by date_format(createTime, '%Y-%m-%d')`;
  }

  getDate(dto: AnalysisDayDTO, data: any) {
    const begin = dto.beginDate.split('');
    const beginDate = new Date();
    beginDate.setFullYear(
      parseInt(begin[0] + begin[1] + begin[2] + begin[3]),
      parseInt(begin[4] + begin[5]) - 1,
      parseInt(begin[6] + begin[7])
    );
    beginDate.setHours(0, 0, 0, 0);

    const end = dto.endDate.split('');
    const endDate = new Date();
    endDate.setFullYear(
      parseInt(end[0] + end[1] + end[2] + end[3]),
      parseInt(end[4] + end[5]) - 1,
      parseInt(end[6] + end[7])
    );
    endDate.setHours(23, 59, 59);
    const days = Math.ceil(
      (endDate.valueOf() - beginDate.valueOf()) / (24 * 60 * 60 * 1000)
    );
    const dates = [] as any[];
    for (let i = 0; i < days; i++) {
      const day = dayjs(beginDate.valueOf() + i * 24 * 60 * 60 * 1000).format(
        'YYYY-MM-DD'
      );
      dates.push(Object.assign({ date: day }, data));
    }
    return dates;
  }
}
