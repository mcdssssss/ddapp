import { EntityModel } from '@midwayjs/orm';
import { Column } from 'typeorm';
import { CommonBase } from './Base';

@EntityModel('user_coupon')
export class UserCouponEntity extends CommonBase {
  @Column({ type: 'char', length: 16, comment: '优惠券编号' })
  couponNo: string;

  @Column({ type: 'char', length: 16, comment: '用户编号' })
  userNo: string;

  @Column({ type: 'varchar', length: 13, nullable: true, comment: '过期时间' })
  deadlineTime: number;

  @Column({ type: 'boolean', default: false, comment: '是否使用' })
  isUse: boolean;

  @Column({ type: 'boolean', default: false, comment: '是否已查看' })
  isLook: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true, comment: '来源描述' })
  originDesc: string;
}
