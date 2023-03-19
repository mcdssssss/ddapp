import { PickDto, Rule, RuleType } from '@midwayjs/validate';
import { SchoolAddress } from '../entity/userSchoolAddress.entity';
import { SelectCommonDTO } from './common.dto';

export class AddressAddDTO {
  @Rule(RuleType.string().max(45).empty(''))
  province: string;

  @Rule(RuleType.string().max(45).empty(''))
  city: string;

  @Rule(RuleType.string().max(45).empty(''))
  district: string;

  @Rule(RuleType.number().required())
  latitude: number;

  @Rule(RuleType.number().required())
  longitude: number;

  @Rule(RuleType.string().max(120).empty(''))
  detail: string;

  @Rule(RuleType.string().max(45).required())
  contactName: string;

  @Rule(RuleType.string().length(11).required())
  mobileNumber: string;

  @Rule(RuleType.object())
  schoolBuild: SchoolAddress;

  @Rule(RuleType.boolean().required())
  isDefault: boolean;
}

export class AddressUpdateDTO extends AddressAddDTO {
  @Rule(RuleType.string().length(16).required())
  addressNo: string;
}

export class AddressDelDTO extends PickDto(AddressUpdateDTO, ['addressNo']) {}

export class AddressListDTO extends SelectCommonDTO {}
