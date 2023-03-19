import { EntityModel } from '@midwayjs/orm';
import { Column } from 'typeorm';
import { CommonAdminBase } from './Base';

@EntityModel('files')
export class FilesEntity extends CommonAdminBase {
  @Column({ type: 'varchar', length: 45, comment: '文件名' })
  fileName: string;

  @Column({ type: 'int', comment: '文件尺寸' })
  fileSize: number;

  @Column({ type: 'varchar', length: 200, comment: '文件链接' })
  fileLink: string;

  @Column({ type: 'varchar', length: 20, comment: '文件后缀' })
  suffix: string;

  @Column({ type: 'int', nullable: true, comment: '文件后缀' })
  groupId: number;
}
