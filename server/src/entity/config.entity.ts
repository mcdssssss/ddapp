import { EntityModel } from '@midwayjs/orm';
import { Column, Unique } from 'typeorm';
import { Base } from './Base';

@EntityModel('configs')
@Unique(['configKey'])
export class ConfigEntity extends Base {
  @Column({ type: 'varchar', length: 45, comment: '关键key' })
  configKey: string;

  @Column({ type: 'json', comment: '配置内容' })
  configContext: any;

  @Column({ type: 'char', length: 16, comment: '管理员' })
  updatedBy: string;
}
