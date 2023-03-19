import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Put,
  Query,
  File,
} from '@midwayjs/decorator';
import { Validate } from '@midwayjs/validate';
import {
  CashAlipayExportExcelDTO,
  CashFailDTO,
  CashListDTO,
  CashSuccessDTO,
} from '../../dto/cash.dto';
import { DefaultError } from '../../error/default.error';
import { AdminMiddleware } from '../../middleware/admin.middleware';
import { CashService } from '../../service/cash.service';
import { QueryService } from '../../service/query.service';
import { BaseController } from '../base.controller';
import { Workbook } from 'exceljs';
import { join } from 'path';
import { createReadStream, existsSync, mkdirSync } from 'fs';
const mime = require('mime-types');

@Controller('/admin/cash')
export class CashController extends BaseController {
  @Inject()
  queryService: QueryService;

  @Inject()
  cashService: CashService;

  @Get('/list', { middleware: [AdminMiddleware] })
  async list(@Query() dto: CashListDTO) {
    if (this.ctx.adminInfo.isDemo) {
      throw new DefaultError('演示账户无权限操作');
    }
    let where = ` ca.bankNo = ba.bankNo `;
    if (dto.cashBy) {
      where += ` and ca.cashBy='${dto.cashBy}' `;
    }
    if (dto.cashNo) {
      where += ` and ca.cashNo='${dto.cashNo}' `;
    }
    if (dto.status) {
      where += ` and ca.status=${dto.status} `;
    }
    if (dto.bankName) {
      where += ` and ba.bankName='%${dto.bankName}%' `;
    }
    if (dto.cardNo) {
      where += ` and ba.cardNo='%${dto.cardNo}%' `;
    }
    if (dto.realname) {
      where += ` and ba.realname='%${dto.realname}%' `;
    }
    const res = await this.queryService.select(this.cashService.cashEntity, {
      tables: `${this.cashService.getTableName()} ca, ${
        this.cashService.banksEntity.metadata.tableName
      } ba`,
      wheres: where,
      order: 'ca.createTime desc',
      current: dto.current,
      pageSize: dto.pageSize,
    });
    return this.responseSuccess('ok', res);
  }

  @Get('/export/check', { middleware: [AdminMiddleware] })
  @Validate()
  async exportCheck(@Query() dto: CashAlipayExportExcelDTO) {
    const result = await this.queryService.select(this.cashService.cashEntity, {
      tables: `${this.cashService.getTableName()} ca, ${
        this.cashService.banksEntity.metadata.tableName
      } ba`,
      wheres: `ca.bankNo = ba.bankNo  and ca.status=0 and ba.bankName='支付宝' `,
      fields: 'ca.*,ba.realname,ba.cardNo',
      order: 'ca.createTime asc',
      current: 1,
      pageSize: dto.count,
    });
    let totalAmount = 0;
    for (const item of result.data) {
      totalAmount += this.filterNumber(item.amount);
    }
    return this.responseSuccess('ok', {
      count: result.count,
      totalAmount: this.filterNumber(totalAmount),
    });
  }

  @Get('/export/alipay')
  @Validate()
  async exportExcel(@Query() dto: CashAlipayExportExcelDTO) {
    const result = await this.queryService.select(this.cashService.cashEntity, {
      tables: `${this.cashService.getTableName()} ca, ${
        this.cashService.banksEntity.metadata.tableName
      } ba`,
      wheres: `ca.bankNo = ba.bankNo  and ca.status=0 and ba.bankName='支付宝' `,
      fields: 'ca.*,ba.realname,ba.cardNo',
      order: 'ca.createTime asc',
      current: 1,
      pageSize: dto.count,
    });

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('页一支付宝批量付款文件上传模板');
    worksheet.addRow(['支付宝批量付款文件模板（前面两行请勿删除）']);
    worksheet.mergeCells('A1:E1');
    const row1 = worksheet.getRow(1);
    row1.height = 24;
    worksheet.getColumn(1).width = 13.19;
    worksheet.getColumn(2).width = 27.36;
    worksheet.getColumn(3).width = 29.36;
    worksheet.getColumn(4).width = 27.69;
    worksheet.getColumn(5).width = 32.19;

    worksheet.addRow([
      '序号（必填）',
      '收款方支付宝账号（必填）',
      '收款方姓名（必填）',
      '金额（必填，单位：元）',
      '备注（选填）',
    ]);

    for (const item of result.data) {
      worksheet.addRow([
        item.id,
        item.cardNo,
        item.realname,
        this.filterNumber(item.amount),
        '佣金',
      ]);
    }

    const excelDir = join(this.ctx.app.getAppDir(), '../tmp');
    if (!existsSync(excelDir)) {
      mkdirSync(excelDir);
    }
    const excelPath = join(excelDir, this.nanoid(16) + '.xlsx');
    await workbook.xlsx.writeFile(excelPath);

    this.ctx.response.set('content-type', mime.lookup('xlsx'));
    return createReadStream(excelPath);
  }

  @Put('/success', { middleware: [AdminMiddleware] })
  async success(@Body() dto: CashSuccessDTO) {
    if (this.ctx.adminInfo.isDemo) {
      throw new DefaultError('演示账户无权限操作');
    }
    const res = await this.cashService.cashEntity.update(
      {
        cashNo: dto.cashNo,
      },
      {
        status: 1,
      }
    );
    if (res.affected === 0) {
      throw new DefaultError('操作失败');
    }
    return this.responseSuccess('操作成功');
  }

  @Put('/fail', { middleware: [AdminMiddleware] })
  async fail(@Body() dto: CashFailDTO) {
    if (this.ctx.adminInfo.isDemo) {
      throw new DefaultError('演示账户无权限操作');
    }
    const res = await this.cashService.cashEntity.update(
      {
        cashNo: dto.cashNo,
      },
      {
        reason: dto.reason,
        status: -1,
      }
    );
    if (res.affected === 0) {
      throw new DefaultError('操作失败');
    }
    return this.responseSuccess('操作成功');
  }

  @Post('/import/alipay', { middleware: [AdminMiddleware] })
  async upload(
    @File('file')
    file: {
      filename: string;
      data: string;
      fieldName: string;
      mineType: string;
    }
  ) {
    const workbook = new Workbook();
    await workbook.xlsx.readFile(file.data);
    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) {
      throw new DefaultError('解析出错');
    }
    const rowHeader = worksheet.getRow(11);
    if (
      rowHeader.getCell(1).value === '序号' &&
      rowHeader.getCell(8).value === '状态' &&
      rowHeader.getCell(8).value === '状态' &&
      rowHeader.getCell(10).value === '失败原因'
    ) {
      const rows = worksheet.getRows(11, worksheet.actualRowCount + 1 - 10);
      let success = 0;
      let refuse = 0;
      for (const item of rows) {
        const sort = item.getCell(1).value;
        const status = item.getCell(8).value;
        const reason = item.getCell(10).value;
        if (sort && status && sort !== '序号') {
          const update = await this.cashService.cashEntity.update(
            {
              id: sort as number,
              status: 0,
            },
            {
              status: status === '成功' ? 1 : -1,
              reason: reason
                ? (reason as string).replace(
                    '请联系对方核实',
                    '请修改为正确的账户后在提交'
                  )
                : '',
            }
          );
          if (update.affected) {
            if (status === '成功') {
              success++;
            } else {
              refuse++;
            }
          }
        }
      }
      return this.responseSuccess('ok', {
        success,
        refuse,
      });
    } else {
      throw new DefaultError('格式错误');
    }
  }
}
