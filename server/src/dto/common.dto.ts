import { Rule, RuleType } from '@midwayjs/validate';

export class SelectCommonDTO {
  @Rule(RuleType.number().default(1))
  current?: number;

  @Rule(RuleType.number().default(10))
  pageSize?: number;
}
export const requiredStatus = RuleType.number().integer().min(0).max(1).required();