import { EntityModel } from '@midwayjs/orm';
import { Column } from 'typeorm';
import { CommonAdminBase } from './Base';

@EntityModel('file_group')
export class FileGroupEntity extends CommonAdminBase {
  @Column({ type: 'varchar', length: 45, comment: '组名' })
  groupName: string;

  @Column({ type: 'varchar', length: 10, default: 'file', comment: '组类型' })
  groupType: 'file' | 'richtext';

  @Column({
    type: 'varchar',
    length: 16,
    default: 'admin',
    comment: '操作人 admin or agent',
  })
  updatedFrom: string;
}
