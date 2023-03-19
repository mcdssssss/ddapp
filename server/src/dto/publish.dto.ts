import { Rule, RuleType } from '@midwayjs/validate';
import { SchoolAddress } from '../entity/userSchoolAddress.entity';

export interface ErrandsServicePublishDetail {
  errandsId: number;
  weight: number;
  desc: string;
  image?: string;
  images?: string;
}

export interface PrintServicePublishDetail {
  siteId: number;
  paperId: number;
  files: string[];
  printColor: 'black' | 'colorful';
  printStyle: 'single' | 'double';
  pageSize: number;
  copySize: number;
}

export interface PlayServicePublishDetail {
  playStyle: 'time' | 'matchUp' | 'task';
  playValue: number;
  desc: string;
  // 赏金
  rewardAmount: number;
}

export interface SoftwareServicePublishDetail {
  desc: string;
  rewardAmount: number;
}
export interface MoveServicePublishDetail {
  needsHelp: boolean;
  vehicleId: number;
}

export interface RepairServicePublishDetail {
  repairPrice: number;
  repairName: string;
  cateName: string;
  desc?: string;
}

export class PublishDTO {
  @Rule(RuleType.object().required())
  startAddress: SchoolAddress;

  @Rule(RuleType.object().required())
  endAddress: SchoolAddress;

  @Rule(RuleType.string().required())
  serviceNanoid: string;

  @Rule(RuleType.number().empty(''))
  fee: number;

  @Rule(RuleType.string().max(80).empty(''))
  remarks: string;

  @Rule(RuleType.object().required())
  serviceDetails:
    | ErrandsServicePublishDetail
    | PrintServicePublishDetail
    | PlayServicePublishDetail
    | MoveServicePublishDetail
    | RepairServicePublishDetail;

  @Rule(RuleType.number().required())
  userCouponId: number;

  @Rule(RuleType.number().required())
  deadlineTime: number;
}
