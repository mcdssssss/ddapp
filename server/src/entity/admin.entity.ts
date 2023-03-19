import { EntityModel } from '@midwayjs/orm';
import { Column, Unique } from 'typeorm';
import { Base } from './Base';

@EntityModel('admins')
@Unique(['adminName'])
export class AdminEntity extends Base {
  @Column({ type: 'varchar', length: 16, unique: true, comment: '管理员编号' })
  adminNo: string;

  @Column({ type: 'varchar', length: 30, comment: '账号' })
  adminName: string;

  @Column({ type: 'varchar', length: 40, nullable: true, comment: '密码' })
  adminPwd: string;

  @Column({ type: 'int', default: 1, comment: '状态' })
  status: 0 | 1;

  @Column({ type: 'varchar', length: 45, comment: '真实姓名' })
  realName: string;

  @Column({ type: 'varchar', length: 11, comment: '手机号' })
  mobileNumber: string;

  @Column({ type: 'varchar', length: 6, nullable: true, comment: '默认密码' })
  defaultPwd: string;

  @Column({ type: 'boolean', default: false, comment: '超级管理员' })
  superAdmin: boolean;

  @Column({ type: 'varchar', length: 200, comment: '头像', nullable: true })
  avatarUrl: string;

  @Column({
    type: 'varchar',
    length: 16,
    nullable: true,
    comment: '管理员编号',
  })
  updatedBy: string;

  @Column({
    type: 'boolean',
    default: false,
    comment: '是否是演示账户',
  })
  isDemo: boolean;
}
