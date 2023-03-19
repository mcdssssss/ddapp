import { EntityModel } from '@midwayjs/orm';
import { Column } from 'typeorm';
import { Base } from './Base';

@EntityModel('cash')
export class CashEntity extends Base {
  @Column({ type: 'char', length: 16, unique: true, comment: '提现编号' })
  cashNo: string;

  @Column({ type: 'varchar', length: 12, comment: '提现用户类型' })
  cashBy: 'user' | 'taker';

  @Column({ type: 'char', length: 16, comment: '提现用户' })
  cashByNo: string;

  @Column({
    type: 'int',
    default: 0,
    comment: '提现状态 0 待提现 1提现成功 -1提现失败',
  })
  status: 0 | 1 | -1;

  @Column({ type: 'double', comment: '提现金额' })
  amount: number;

  @Column({ type: 'char', length: 16, comment: '提现账户' })
  bankNo: string;

  @Column({ type: 'varchar', length: 100, nullable: true, comment: '提现理由' })
  reason: string;
}
