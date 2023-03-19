import { Rule, RuleType } from '@midwayjs/validate';

export class MapLocationDTO {
  @Rule(RuleType.number().required())
  latitude: number;

  @Rule(RuleType.number().required())
  longitude: number;
}

export class MapSearchDTO {
  @Rule(RuleType.string().required())
  cityName: string;

  @Rule(RuleType.string().required().empty(''))
  keyword: string;

  @Rule(RuleType.number())
  current?: number;

  @Rule(RuleType.number())
  pageSize?: number;
}

export class AddressParseDTO {
  @Rule(RuleType.string().required().empty())
  keyword: string;
}
