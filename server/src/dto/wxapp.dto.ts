import { Rule, RuleType } from '@midwayjs/validate';
import { SelectCommonDTO } from './common.dto';

export class WxappLoginDTO {
  @Rule(RuleType.string().required())
  code: string;

  @Rule(RuleType.string().empty(''))
  fromNo?: string;

  @Rule(RuleType.string().empty(''))
  shareUserNo?: string;
}

export class WxappListDTO extends SelectCommonDTO {
  @Rule(RuleType.string().empty(''))
  userNo?: string;

  @Rule(RuleType.string().empty(''))
  openid?: string;
}

export class AlipayListDTO extends SelectCommonDTO {
  @Rule(RuleType.string().empty(''))
  userNo?: string;

  @Rule(RuleType.string().empty(''))
  aliUserId?: string;
}

export class WxappUploadDTO {
  @Rule(RuleType.string().required())
  httpUrl: string;

  @Rule(RuleType.string().required())
  appName: string;
}
