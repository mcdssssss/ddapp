import { EntityModel } from '@midwayjs/orm';
import { Column } from 'typeorm';
import { CommonAdminAgentBase } from './Base';

export interface BannerInterface {
  image: string;
  path: string;
}
@EntityModel('school_carousels')
export class SchoolCarouselsEnitty extends CommonAdminAgentBase {
  @Column({ type: 'char', length: 16, unique: true, comment: '编号' })
  carouselNo: string;

  @Column({ type: 'json', comment: '广告图' })
  banners: BannerInterface[];
}
