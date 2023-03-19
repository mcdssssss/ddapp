import { PickDto, Rule, RuleType } from '@midwayjs/validate';
import { SelectCommonDTO } from './common.dto';

export class MobileNumberDTO {
  @Rule(
    RuleType.string()
      .required()
      .pattern(/^1[3-9]\d{9}$/)
  )
  mobileNumber: string;
}
export class UserMobileVerifyDTO extends MobileNumberDTO {
  @Rule(RuleType.string().required().length(6))
  verifyCode: string;

  @Rule(RuleType.string().empty(''))
  fromNo?: string;

  @Rule(RuleType.string().empty(''))
  shareUserNo?: string;
}

export class UserPwdDTO extends PickDto(UserMobileVerifyDTO, ['mobileNumber']) {
  @Rule(RuleType.string().required())
  pwd: string;
}

export class UserMobileLoginDTO extends UserMobileVerifyDTO {
  @Rule(RuleType.string().empty(''))
  ticket?: string;
}

export class mobileVerifyDTO extends UserMobileVerifyDTO {
  // 类型
  @Rule(RuleType.string().required())
  type: 'changeMobile' | 'unbindWx' | 'bindWx' | 'setpwd' | 'updatePwd';
}

export class UserSetPwdDTO {
  @Rule(RuleType.string().required())
  pwd: string;

  @Rule(RuleType.string().required())
  confirmPwd: string;
}

export class UserUpdateDTO {
  @Rule(RuleType.string().min(2).max(200).empty())
  avatarUrl: string;

  @Rule(RuleType.string().min(1).max(45).empty())
  nickName: string;

  @Rule(RuleType.number())
  gender: 0 | 1 | 2;

  @Rule(RuleType.string().min(2).max(45).empty(''))
  province: string;

  @Rule(RuleType.string().min(2).max(45).empty(''))
  city: string;

  @Rule(RuleType.string().min(2).max(45).empty(''))
  area: string;
}

export class UserAddressAddDTO {
  @Rule(RuleType.string().required())
  province: string;

  @Rule(RuleType.string().required())
  city: string;

  @Rule(RuleType.string().required())
  district: string;

  @Rule(RuleType.number().required())
  latitude: number;

  @Rule(RuleType.number().required())
  longitude: number;

  @Rule(RuleType.string().required())
  streetNumber: string;

  @Rule(RuleType.string().required())
  addressDetail: string;

  @Rule(RuleType.string().required())
  contactName: string;

  @Rule(RuleType.string().required())
  mobileNumber: string;

  @Rule(RuleType.string())
  addressNo?: string;

  @Rule(RuleType.string())
  type?: 'home' | 'company';

  @Rule(RuleType.number())
  id?: number;
}

export class UserListDTO extends SelectCommonDTO {
  @Rule(RuleType.string())
  userNo?: string;

  @Rule(RuleType.string())
  mobileNumber?: string;

  @Rule(RuleType.string())
  nickName?: string;
}

export class UserStatusDTO {
  @Rule(RuleType.string().required())
  userNo: string;

  @Rule(RuleType.number().required())
  status: 0 | 1;
}
