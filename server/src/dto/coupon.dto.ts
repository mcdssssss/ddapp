import { PickDto, Rule, RuleType } from '@midwayjs/validate';
import { ServerType } from '../interface';
import { SelectCommonDTO } from './common.dto';

export class CouponAddDTO {
  @Rule(RuleType.string().required().max(45))
  couponName: string;

  @Rule(RuleType.number().required())
  deadlineDays: number;

  @Rule(RuleType.number().required())
  discountAmount: number;

  @Rule(RuleType.number())
  conditionsAmount?: number;

  @Rule(RuleType.string().required())
  conditionService: ServerType | 'ALL';

  @Rule(RuleType.number())
  limitNumber: number;

  @Rule(RuleType.number().required())
  status: 0 | 1;
}

export class CouponUpdateDTO extends CouponAddDTO {
  @Rule(RuleType.string().required())
  couponNo: string;
}

export class CouponStatusDTO extends PickDto(CouponUpdateDTO, [
  'couponNo',
  'status',
]) {}

export class CouponListDTO extends SelectCommonDTO {
  @Rule(RuleType.string())
  couponNo?: string;

  @Rule(RuleType.string())
  couponName?: string;

  @Rule(RuleType.string())
  conditionService?: ServerType | 'ALL';

  @Rule(RuleType.number())
  status?: 0 | 1;
}

export class UserCouponListDTO {
  @Rule(RuleType.number())
  price?: number;
}

export class CouponSendDTO {
  @Rule(RuleType.string().length(16).required())
  couponNo: string;

  @Rule(RuleType.string().length(16).required())
  userNo: string;
}
