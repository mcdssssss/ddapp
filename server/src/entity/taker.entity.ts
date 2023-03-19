import { EntityModel } from '@midwayjs/orm';
import { Column, Unique } from 'typeorm';
import { Base } from './Base';
const uniqueArr = ['userNo'];

export interface CardImage {
  studentCard?: string; // 学生证
  avatarFaceImage?: string; // 头像一面的身份证照片
  nationalFaceImage?: string; // 国徽一面的身份证照片
}
// 接单员
@EntityModel('taker')
@Unique(uniqueArr)
export class TakerEntity extends Base {
  @Column({ type: 'char', length: 16, unique: true, comment: '接单员编号' })
  takerNo: string;

  @Column({ type: 'int', default: 0, comment: '状态' })
  status: 0 | 1 | -1;

  @Column({ type: 'char', length: 16, comment: '用户编号' })
  userNo: string;

  @Column({ type: 'varchar', length: 45, comment: '真实姓名' })
  realName: string;

  @Column({
    type: 'varchar',
    length: 18,
    comment: '身份证号或学号',
  })
  idCard: string;

  @Column({
    type: 'varchar',
    length: 16,
    nullable: true,
    comment: '学校编号',
  })
  schoolNo: string;

  @Column({ type: 'json', comment: '身份证或学生证照片' })
  cardImages: CardImage;

  @Column({ type: 'varchar', length: 100, nullable: true, comment: '拒绝理由' })
  refuseMsg: string;

  @Column({ type: 'json', comment: '来自那个端' })
  fromClient: {
    provider: string;
    openid?: string; // 用户编号
    aliUserId?: string; // 用户编号
  };
}
