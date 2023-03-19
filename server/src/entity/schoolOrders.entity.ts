import { EntityModel } from '@midwayjs/orm';
import { Column } from 'typeorm';
import { DISCOUNT_TYPE } from '../constant';
import {
  OrderType,
  PayType,
  RefundStatus,
  SchoolOrderPersonType,
} from '../interface';
import { Base } from './Base';
import { ServiceData } from './school.entity';
export interface SchoolAddressOptions {
  area: string;
  areaId: number;
  build: string;
  buildId: number;
  detail: string;
}

// 发布的地址Interface
export interface SchoolAddress {
  noneText?: string; // 无地址展示的内容
  contactName?: string;
  mobileNumber?: string;
  province?: string;
  city?: string;
  district?: string;
  detail?: string;
  latitude?: number;
  longitude?: number;
  schoolBuild?: SchoolAddressOptions;
}

export interface ErrandsPriceDetail {
  startPrice: number;
  distance: number;
  weight: number;
  weightPrice: number[];
  // 重量超出部分
  weightExcessPart: number[];
  // 重量超出部分价格
  weightExcessPartPrice: number[];
  weightDetail: string[];

  distancePrice: number[];
  distanceExcessPart: number[];
  distanceExcessPartPrice: number[];
  distanceDetail: string[];

  timePrice: number;
  // 时间范围
  timeRange: string[];
  timeDetail: string;
  totalPrice: number;

  service: ServiceData;

  desc?: string;

  subTitle: string;
}

/**
 * 优惠详情
 */
export interface DiscountDetails {
  // 优惠类型
  type: DISCOUNT_TYPE;
  // 类型对应的Id或编号
  typeValue: number | string;
  label: string;
  value: number;
}

@EntityModel('school_orders')
export class SchoolOrdersEntity extends Base {
  @Column({ type: 'varchar', length: 32, unique: true, comment: '订单编号' })
  orderNo: string;

  @Column({ type: 'json', nullable: true, comment: '起步地址' })
  startAddress: SchoolAddress;

  @Column({ type: 'json', comment: '结束地址' })
  endAddress: SchoolAddress;

  @Column({
    type: 'varchar',
    length: 30,
    comment: '订单类型 如：errands|print',
  })
  orderType: string;

  @Column({
    type: 'varchar',
    length: 13,
    comment: '截止时间戳',
  })
  deadlineTime: number;

  @Column({ type: 'json', comment: '价格详细信息' })
  priceDetails: ErrandsPriceDetail;

  @Column({ type: 'json', comment: '优惠详细信息' })
  discountDetails: DiscountDetails[];

  @Column({ type: 'double', default: 0, comment: '总优惠量' })
  totalDiscount: number;

  @Column({
    type: 'int',
    default: 0,
    comment: '小费',
  })
  fee: number;

  @Column({ type: 'double', comment: '总价' })
  totalPrice: number;

  @Column({ type: 'varchar', length: 80, nullable: true, comment: '备注' })
  remarks: string;

  @Column({ type: 'char', length: 16, comment: '用户编号 ' })
  userNo: string;

  @Column({ type: 'char', length: 16, nullable: true, comment: '接单员' })
  takerNo: string;

  @Column({ type: 'int', comment: '状态' })
  status: OrderType;

  @Column({ type: 'varchar', length: 100, nullable: true, comment: '取消理由' })
  cancelReason: string;

  @Column({ type: 'varchar', length: 20, nullable: true, comment: '由谁取消' })
  cancelBy: SchoolOrderPersonType;

  @Column({ type: 'char', length: 16, nullable: true, comment: '由谁取消编号' })
  cancelByNo: string;

  @Column({
    type: 'varchar',
    length: 60,
    nullable: true,
    unique: true,
    comment: '退款单号',
  })
  refundNo: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: '由谁点击完成',
  })
  completeBy: SchoolOrderPersonType;

  @Column({
    type: 'varchar',
    length: 16,
    nullable: true,
    comment: '由谁点击完成',
  })
  completeByNo: string;

  @Column({ type: 'double', default: 0, comment: '退款金额' })
  refundAmount: number;

  @Column({ type: 'int', default: 0, comment: '退款状态' })
  refundStatus: RefundStatus;

  @Column({ type: 'varchar', length: 10, nullable: true, comment: '支付类型' })
  payType: PayType;

  @Column({ type: 'datetime', width: 6, nullable: true, comment: '支付时间' })
  payTime: Date;

  @Column({ type: 'datetime', width: 6, nullable: true, comment: '接单时间' })
  sendTime: Date;

  @Column({ type: 'datetime', width: 6, nullable: true, comment: '送完时间' })
  getTime: Date;

  @Column({
    type: 'datetime',
    width: 6,
    nullable: true,
    comment: '确认成功时间',
  })
  successTime: Date;

  @Column({
    type: 'datetime',
    width: 6,
    nullable: true,
    comment: '交易关闭时间',
  })
  closeTime: Date;

  @Column({
    type: 'datetime',
    width: 6,
    nullable: true,
    comment: '取消订单时间',
  })
  cancelTime: Date;

  @Column({ type: 'datetime', width: 6, nullable: true, comment: '退款时间' })
  refundTime: Date;

  @Column({ type: 'json', comment: '来自那个端' })
  fromClient: {
    provider: string;
    openid?: string; // 用户编号
    aliUserId?: string; // 用户编号
  };

  @Column({ type: 'boolean', default: 1, comment: '是否放置到大厅' })
  intoHall: boolean;

  @Column({ type: 'int', default: 0, comment: '当日订单号码' })
  orderCountNo: number;
}
