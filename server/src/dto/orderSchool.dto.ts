import { Rule, RuleType } from '@midwayjs/validate';
import { OrderType } from '../interface';
import { SelectCommonDTO } from './common.dto';

export class OrderSchoolListDTO extends SelectCommonDTO {
  @Rule(RuleType.string().required())
  orderType: 'user' | 'taker';

  @Rule(RuleType.string().required())
  status: 'all' | 'waitPay' | 'waitTake' | 'waitSuccess' | 'complete';
}

export class OrderSchoolOrderListDTO extends SelectCommonDTO {
  @Rule(RuleType.string().empty(''))
  orderType?: string;
}

export class OrderSchoolInfoDTO {
  @Rule(RuleType.string().required())
  orderNo: string;
}

export class AdminOrderSchoolTakerDTO extends OrderSchoolInfoDTO {
  @Rule(RuleType.string().required())
  takerNo: string;
}

export class OrderSchoolInfoTipDTO extends OrderSchoolInfoDTO {
  @Rule(RuleType.string().required())
  cancelBy: 'user' | 'taker' | 'mch';
}

export class AdminOrderSchoolListDTO extends SelectCommonDTO {
  @Rule(RuleType.string().empty(''))
  schoolNo?: string;

  @Rule(RuleType.string().empty(''))
  schoolName?: string;

  @Rule(RuleType.string().empty(''))
  orderType?: string;

  @Rule(RuleType.number())
  status?: OrderType;

  @Rule(RuleType.string().empty(''))
  orderNo?: string;

  @Rule(RuleType.string().empty(''))
  userNo?: string;

  @Rule(RuleType.number())
  intoHall?: 0 | 1;
}

export class SchoolOrderCapitalTrendListDTO extends SelectCommonDTO {
  @Rule(RuleType.string())
  orderNo?: string;

  @Rule(RuleType.string())
  takerNo?: string;

  @Rule(RuleType.string().empty(''))
  desc?: string;
}

export class SchoolOrderOneClickhandleDTO {
  // 待付款自动取消
  @Rule(RuleType.boolean().required())
  waitPayAutoCanel: boolean;

  // 自动完成
  @Rule(RuleType.boolean().required())
  autoCompete: boolean;

  // 超过截止时间未接单自动取消
  @Rule(RuleType.boolean().required())
  deadlineAutoCancel: boolean;
}
