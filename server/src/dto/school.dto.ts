import { PickDto, Rule, RuleType } from '@midwayjs/validate';
import { ServiceObject, TakeOutSetting } from '../entity/school.entity';
import { BannerInterface } from '../entity/schoolCarousels.entity';
import { SelectCommonDTO } from './common.dto';
import { OrderCancelRule } from './config.dto';

export class SchoolAddDTO {
  @Rule(RuleType.string().max(60).required())
  schoolName: string;

  @Rule(RuleType.string().max(200).required())
  schoolLogo: string;

  @Rule(RuleType.string().max(40).required())
  province: string;

  @Rule(RuleType.string().max(40).required())
  city: string;

  @Rule(RuleType.string().max(40).required())
  area: string;

  @Rule(RuleType.string().max(100).required())
  addressDetail: string;

  @Rule(RuleType.number().required())
  latitude: number;

  @Rule(RuleType.number().required())
  longitude: number;

  @Rule(RuleType.number().required())
  status: 0 | 1;

  @Rule(RuleType.string().empty(''))
  cancelOrderTemplateNo?: string;
}

export class SchoolUpdateDTO extends SchoolAddDTO {
  @Rule(RuleType.string().max(16).required())
  schoolNo: string;
}

export class SchoolUpdateServiceDTO {
  @Rule(RuleType.object().required())
  serviceData: ServiceObject;
}

export class SchoolStatusDTO extends PickDto(SchoolUpdateDTO, [
  'schoolNo',
  'status',
]) {}

export class SchoolInfoDTO extends PickDto(SchoolStatusDTO, ['schoolNo']) {}
export class SchoolListDTO extends SelectCommonDTO {
  @Rule(RuleType.string().empty(''))
  schoolName?: string;

  @Rule(RuleType.string().empty(''))
  province?: string;

  @Rule(RuleType.string().empty(''))
  city?: string;

  @Rule(RuleType.string().empty(''))
  area?: string;

  @Rule(RuleType.number())
  status?: 0 | 1;
}

export class AgentSchoolListDTO extends SchoolListDTO {
  @Rule(RuleType.string().required())
  schoolType: string;
}

export class SchoolAreaAddDTO {
  @Rule(RuleType.string().required())
  areaName: string;

  @Rule(RuleType.number().required())
  status: 0 | 1;
}

export class SchoolAreaUpdateDTO extends SchoolAreaAddDTO {
  @Rule(RuleType.number().required())
  id: number;
}

export class SchoolAreaStatusDTO extends PickDto(SchoolAreaUpdateDTO, [
  'id',
  'status',
]) {}

export class SchoolAreaDelDTO extends PickDto(SchoolAreaUpdateDTO, ['id']) {}

export class SchoolBuildAddDTO {
  @Rule(RuleType.string().required())
  buildName: string;

  @Rule(RuleType.string().required())
  remark: string;

  @Rule(RuleType.number().required())
  areaId: number;

  @Rule(RuleType.string())
  latlng: string;
}

export class SchoolBuildUpdateDTO extends SchoolBuildAddDTO {
  @Rule(RuleType.number().required())
  id: number;
}

export class SchoolBuildDelDTO extends PickDto(SchoolBuildUpdateDTO, ['id']) {}

export class SchoolListByApp extends SelectCommonDTO {
  @Rule(RuleType.number())
  latitude?: number;

  @Rule(RuleType.number())
  longitude?: number;

  @Rule(RuleType.string().empty(''))
  notIn?: string;

  @Rule(RuleType.string().empty(''))
  keyword?: string;
}

export class BaseAppSchoolSiteList extends SelectCommonDTO {
  @Rule(RuleType.string().empty(''))
  keyword?: string;
}

export class BaseAppSchoolSiteInfo extends SchoolInfoDTO {
  @Rule(RuleType.string())
  id?: number;
}

export class BaseAppSchoolServiceInfo extends SchoolInfoDTO {
  @Rule(RuleType.string().length(20).required())
  nanoid: string;
}

export class SchoolCarouselUpsertDTO {
  @Rule(RuleType.array().required())
  banners: BannerInterface[];
}

export class SchoolOCTAddDTO {
  @Rule(RuleType.string().max(45).required())
  templateName: string;

  @Rule(RuleType.array().required())
  userCancelRules: OrderCancelRule[];

  @Rule(RuleType.array().required())
  takerCancelRules: OrderCancelRule[];

  @Rule(RuleType.array().required())
  mchCancelRules: OrderCancelRule[];

  @Rule(RuleType.array().required())
  userCancelTips: string[];

  @Rule(RuleType.array().required())
  adminCancelTips: string[];

  @Rule(RuleType.array().required())
  agentCancelTips: string[];

  @Rule(RuleType.array().required())
  takerCancelTips: string[];

  @Rule(RuleType.array().required())
  mchCancelTips: string[];
}

export class SchoolOCTUpdateDTO extends SchoolOCTAddDTO {
  @Rule(RuleType.string().length(16).required())
  orderCancelTemplateNo: string;
}

export class SchoolOCTDelDTO extends PickDto(SchoolOCTUpdateDTO, [
  'orderCancelTemplateNo',
]) {}

export class SchoolOCTListDTO extends SelectCommonDTO {
  @Rule(RuleType.string().empty(''))
  orderCancelTemplateNo?: string;

  @Rule(RuleType.string().empty(''))
  templateName: string;
}

export class SchoolTakeOutSetDTO extends SchoolInfoDTO {
  @Rule(RuleType.object().required())
  takeOutSetting: TakeOutSetting;
}
