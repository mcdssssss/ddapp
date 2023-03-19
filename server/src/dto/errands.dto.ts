import { PickDto, Rule, RuleType } from '@midwayjs/validate';
import { AddressType, RulesInterface } from '../entity/errandsTmplate.entity';
import { SelectCommonDTO } from './common.dto';

export class ErrandsAddDTO {
  @Rule(RuleType.string().required())
  templateName: string;

  @Rule(RuleType.string().required())
  showName: string;

  @Rule(RuleType.array().required())
  weightRules: RulesInterface[];

  @Rule(RuleType.array().required())
  distanceRules: RulesInterface[];

  @Rule(RuleType.array().required())
  timeRules: RulesInterface[];

  @Rule(RuleType.array().required())
  tags: string[];

  @Rule(RuleType.string().required())
  startAddressType: AddressType;

  @Rule(RuleType.string().required())
  startAddressPlaceholder: string;

  @Rule(RuleType.string().required())
  endAddressType: AddressType;

  @Rule(RuleType.string().required())
  endAddressPlaceholder: string;

  @Rule(RuleType.string().required())
  descPlaceholder: string;
}

export class ErrandsUpdateDTO extends ErrandsAddDTO {
  @Rule(RuleType.number().required())
  id: number;
}

export class ErrandsDelDTO extends PickDto(ErrandsUpdateDTO, ['id']) {}

export class ErrandsListDTO extends SelectCommonDTO {
  @Rule(RuleType.string().empty(''))
  templateName: string;

  @Rule(RuleType.string().empty(''))
  showName: string;

  @Rule(RuleType.number())
  id: number;
}
