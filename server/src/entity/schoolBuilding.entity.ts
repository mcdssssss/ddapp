import { EntityModel } from '@midwayjs/orm';
import { Column } from 'typeorm';
import { CommonAdminAgentBase } from './Base';

@EntityModel('school_building')
export class SchoolBuildingEntity extends CommonAdminAgentBase {
  @Column({ type: 'varchar', length: 45, comment: '建筑物名称' })
  buildName: string;

  @Column({ type: 'varchar', length: 45, comment: '备注', nullable: true })
  remark: string;

  @Column({ type: 'int', comment: '区域id' })
  areaId: number;

  @Column({ type: 'varchar', length: 100, comment: '纬度经度' })
  latlng: string;
}
