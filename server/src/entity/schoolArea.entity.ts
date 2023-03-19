import { EntityModel } from '@midwayjs/orm';
import { Column } from 'typeorm';
import { CommonAdminAgentBase } from './Base';

@EntityModel('school_area')
export class SchoolAreaEntity extends CommonAdminAgentBase {
  @Column({ type: 'varchar', length: 45, comment: '区域名称' })
  areaName: string;

  @Column({ type: 'int', comment: '显示状态' })
  status: 0 | 1;
}
