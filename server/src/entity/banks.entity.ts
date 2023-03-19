import { EntityModel } from '@midwayjs/orm';
import { Column } from 'typeorm';
import { CommonBase } from './Base';

@EntityModel('banks')
export class BanksEntity extends CommonBase {
  @Column({ type: 'char', length: 16, comment: '编号' })
  bankNo: string;

  @Column({ type: 'varchar', length: 32, comment: '银行卡号' })
  cardNo: string;

  @Column({ type: 'varchar', length: 30, comment: '账户姓名' })
  realname: string;

  @Column({ type: 'varchar', length: 100, comment: '开户行' })
  bankName: string;

  @Column({ type: 'char', length: 16, comment: '编号' })
  userNo: string;
}
