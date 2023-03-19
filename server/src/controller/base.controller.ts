import { Inject, Controller } from '@midwayjs/decorator';
import { Context } from 'egg';
import { ResultResponse } from '../interface';
import { nanoid } from 'nanoid';
import { InsertResult, UpdateResult } from 'typeorm';
import { DefaultError } from '../error/default.error';
import { formatToLocalDate, filterDeadlineTime } from '../utils/common';

@Controller('/')
export class BaseController {
  @Inject()
  ctx: Context;

  nanoid(len = 13) {
    return nanoid(len);
  }

  returnInsert(result: InsertResult, msg = '添加', data?: any) {
    if (!result.raw.insertId) {
      throw new DefaultError(msg + '失败');
    }
    return this.responseSuccess(msg + '成功', data);
  }

  returnUpdate(result: UpdateResult, msg = '修改', data?: any) {
    if (result.affected === 0) {
      throw new DefaultError(msg + '失败');
    }
    return this.responseSuccess(msg + '成功', data);
  }

  returnStatus(result: UpdateResult, msg = '修改状态', data?: any) {
    return this.returnUpdate(result, msg, data);
  }

  returnDel(result: UpdateResult, msg = '删除', data?: any) {
    return this.returnUpdate(result, msg, data);
  }

  /**
   * 响应成功
   * @param msg
   * @param data
   * @returns
   */
  responseSuccess(msg: string, data?: any): ResultResponse {
    return this.responseBody({ msg, data, code: 200 });
  }

  /**
   * 响应失败
   * @param msg
   * @param data
   * @returns
   */
  responseFail(msg: string, data?: any) {
    return this.responseBody({ msg, data, code: 1000 });
  }

  /**
   * 响应体
   * @param param0
   * @returns
   */
  responseBody({
    msg,
    data,
    code,
  }: {
    msg: string;
    data: any;
    code: number;
  }): ResultResponse {
    return {
      code,
      msg,
      data,
    };
  }

  filterNumber(num: number) {
    return Math.floor(Math.round(num * 100)) / 100;
  }

  schoolOrderListFilter(result: any) {
    for (const item of result.data) {
      if (item.startAddress) {
        item.startAddress = JSON.parse(item.startAddress);
      }
      if (item.endAddress) {
        item.endAddress = JSON.parse(item.endAddress);
      }
      if (item.priceDetails) {
        item.priceDetails = JSON.parse(item.priceDetails);
      }
      if (item.createTime) {
        item.createTimeLocal = formatToLocalDate(item.createTime);
      }
      if (item.deadlineTime) {
        item.deadlineTime = filterDeadlineTime(parseInt(item.deadlineTime));
      }
      if (item.discountDetails) {
        item.discountDetails = JSON.parse(item.discountDetails);
      }
    }
  }
}
