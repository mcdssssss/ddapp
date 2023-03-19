import { Controller, Get, Inject } from '@midwayjs/decorator';
import { DefaultError } from '../../../error/default.error';
import { AppMiddleware } from '../../../middleware/app.middleware';
import { SchoolOrdersService } from '../../../service/schoolOrders.service';
import { TakerService } from '../../../service/taker.service';
import { BaseController } from '../../base.controller';

@Controller('/api/baseapp/taker/analysis', { middleware: [AppMiddleware] })
export class BaseappTakerAnalysisController extends BaseController {
  @Inject()
  takerService: TakerService;

  @Inject()
  orderService: SchoolOrdersService;

  @Get('/')
  async getData() {
    const taker = await this.takerService.takerEntity.findOne({
      where: {
        userNo: this.ctx.userInfo.userNo,
      },
    });
    if (!taker) {
      throw new DefaultError('接单员不存在');
    }
    const data = await this.takerService.getCapital(taker.takerNo);

    const date = new Date();
    const dateValue = `${date.getFullYear()}${
      date.getMonth() + 1
    }${date.getDate()}`;
    // 今日成单
    const today = await this.takerService.cashEntity.query(
      `select count(*) as total from ${this.orderService.getTableName()} where date_format(successTime,'%Y%c%e') = '${dateValue}' and status=4 and (takerNo='${
        taker.takerNo
      }')`
    );
    // 本月成单
    const month = await this.takerService.cashEntity.query(
      `select count(*) as total from ${this.orderService.getTableName()} where date_format(successTime,'%Y%c%e') <= '${dateValue}' and date_format(successTime,'%Y%c%e') >= '${date.getFullYear()}${
        date.getMonth() + 1
      }1' and status=4 and (takerNo='${taker.takerNo}' )`
    );
    // 累计成单
    const all = await this.takerService.cashEntity.query(
      `select count(*) as total from ${this.orderService.getTableName()} where status=4 and (takerNo='${
        taker.takerNo
      }' )`
    );
    const todayTotal = today[0].total;
    const monthTotal = month[0].total;
    const allTotal = all[0].total;
    return this.responseSuccess(
      'ok',
      Object.assign(data, { todayTotal, monthTotal, allTotal })
    );
  }
}
