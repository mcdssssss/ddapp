import { EntityModel } from '@midwayjs/orm';
import { Column } from 'typeorm';
import { CommonBase } from './Base';

export interface SchoolAddress {
  area: string;
  areaId: number;
  build: string;
  buildId: number;
  detail: string;
}

@EntityModel('users_school_address')
export class UserSchoolAddressEntity extends CommonBase {
  @Column({ type: 'char', length: 16, unique: true })
  addressNo: string;

  @Column({ type: 'varchar', length: 45, comment: '省' })
  province: string;

  @Column({ type: 'varchar', length: 45, comment: '市' })
  city: string;

  @Column({ type: 'varchar', length: 45, comment: '区' })
  district: string;

  @Column({ type: 'double', comment: '纬度' })
  latitude: number;

  @Column({ type: 'double', comment: '经度' })
  longitude: number;

  @Column({ type: 'varchar', length: 120, nullable: true, comment: '详细地址' })
  detail: string;

  @Column({ type: 'char', length: 16 })
  userNo: string;

  @Column({ type: 'varchar', length: 45, comment: '联系人姓名' })
  contactName: string;

  @Column({ type: 'char', length: 11, comment: '联系人手机号' })
  mobileNumber: string;

  @Column({ type: 'json', nullable: true, comment: '学校地址' })
  schoolBuild: SchoolAddress;
}
