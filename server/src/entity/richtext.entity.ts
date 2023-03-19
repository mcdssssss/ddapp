import { EntityModel } from '@midwayjs/orm';
import { Column } from 'typeorm';
import { CommonAdminBase } from './Base';

@EntityModel('richtext')
export class RichtextEntity extends CommonAdminBase {
  @Column({ type: 'char', length: 16, comment: '编号' })
  richNo: string;

  @Column({ type: 'varchar', length: 50, comment: '标题' })
  richTitle: string;

  @Column({ type: 'varchar', length: 200, comment: '封面' })
  richImage: string;

  @Column({ type: 'text', comment: '文本内容' })
  richContent: string;

  @Column({ type: 'int', default: 0, comment: '组ID' })
  groupId: number;
}
