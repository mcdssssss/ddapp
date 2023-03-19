import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class Base {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}

export class CommonBase extends Base {
  @Column({ type: 'boolean', default: false, comment: '软删除' })
  isDelete: boolean;
}

export class CommonAdminAgentBase extends CommonBase {
  @Column({ type: 'varchar', length: 16, comment: '操作人 admin or agent' })
  updatedFrom: string;

  @Column({ type: 'char', length: 16, comment: '操作人No' })
  updatedBy: string;
}

export class CommonAdminBase extends CommonBase {
  @Column({ type: 'char', length: 16, comment: '操作人No' })
  updatedBy: string;
}
