import { PickDto, Rule, RuleType } from '@midwayjs/validate';
import { SelectCommonDTO } from './common.dto';

export class AdminDTO {
  @Rule(RuleType.string())
  adminName: string;

  @Rule(RuleType.string())
  realName: string;

  @Rule(RuleType.string())
  mobileNumber: string;

  @Rule(RuleType.string().empty(''))
  avatarUrl?: string;

  @Rule(RuleType.boolean())
  isDemo?: boolean;
}

export class AdminUpdateDTO extends AdminDTO {
  @Rule(RuleType.string())
  adminNo: string;
}

export class AdminUpdateSelfDTO extends PickDto(AdminDTO, [
  'realName',
  'avatarUrl',
  'mobileNumber',
]) {}

export class AdminLoginDTO {
  @Rule(RuleType.string().required())
  adminName: string;

  @Rule(RuleType.string().required())
  adminPwd: string;

  @Rule(RuleType.string().required())
  verifyCode: string;

  // 验证码编号
  @Rule(RuleType.string().required())
  no: string;
}

export class AdminInitDTO extends PickDto(AdminLoginDTO, [
  'adminName',
  'adminPwd',
]) {
  @Rule(RuleType.string().length(11).required())
  mobileNumber: string;

  @Rule(RuleType.string().max(45).required())
  realName: string;

  @Rule(RuleType.string().required())
  confirmPwd: string;
}

export class AdminSetpwdDTO extends PickDto(AdminInitDTO, [
  'adminPwd',
  'confirmPwd',
]) {}

export class AdminUpdatepwdDTO extends AdminSetpwdDTO {
  @Rule(RuleType.string().required())
  oldpwd: string;
}

export class AdminListDTO extends SelectCommonDTO {
  @Rule(RuleType.string())
  adminName?: string;

  @Rule(RuleType.string())
  realName?: string;

  @Rule(RuleType.string())
  adminNo?: string;

  @Rule(RuleType.string())
  mobileNumber?: string;

  @Rule(RuleType.number())
  status?: 0 | 1;
}

export class AdminStatusDTO extends PickDto(AdminUpdateDTO, ['adminNo']) {
  @Rule(RuleType.number())
  status: 0 | 1;
}

export class AdminResetPwdDTO extends PickDto(AdminUpdateDTO, ['adminNo']) {}
