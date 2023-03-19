import { EntityModel } from '@midwayjs/orm';
import { Column, Unique } from 'typeorm';
import { Base } from './Base';
@EntityModel('school_balance_sheet')
@Unique(['orderNo'])
export class SchoolBalanceSheetEntity extends Base {
  @Column({ type: 'varchar', length: 50, comment: '订单编号' })
  orderNo: string;

  @Column({ type: 'char', length: 16, comment: '接单员编号' })
  takerNo: string;

  @Column({ type: 'double', comment: '平台收入' })
  platformIncome: number;

  @Column({ type: 'double', comment: '接单员收入' })
  takerIncome: number;

  @Column({ type: 'varchar', length: 100, nullable: true, comment: '描述' })
  desc: string;
}
