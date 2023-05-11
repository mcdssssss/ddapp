import { PickDto, Rule, RuleType } from '@midwayjs/validate';

export class ConfigSchoolTypeDTO {
  @Rule(RuleType.string().empty(''))
  schoolType?: 'school' | 'community';
}

export class AppauthUpsertDTO {
  @Rule(RuleType.string().required())
  wxAppId: string;

  @Rule(RuleType.string().required())
  wxAppSecret: string;

  @Rule(RuleType.string().required())
  wxUploadKey: string;
}

export class MapKeyDTO {
  @Rule(RuleType.string().required())
  mapKey: string;
}

export class AliDTO {
  @Rule(RuleType.string().required())
  accessKeyId: string;

  @Rule(RuleType.string().required())
  accessKeySecret: string;

  @Rule(RuleType.string().required())
  arn: string;

  @Rule(RuleType.string().required())
  ossRegion: string;

  @Rule(RuleType.string().required())
  ossBucket: string;

  @Rule(RuleType.string().required())
  smsSignName: string; // 短信签名

  @Rule(RuleType.string().required())
  smsTemplateCode: string;
}

// 概率获得的接口
export interface GetRulesProbability {
  couponNo: string;
  // 概率
  probability: number;
}

export class CouponSetDTO {
  // 新用户获得优惠券渠道打开
  @Rule(RuleType.boolean().required())
  newUserOpen: boolean;

  // 用户用优惠券编号 从数组中选一张
  @Rule(RuleType.array().required())
  newUserRules: GetRulesProbability[];

  // 分享获得优惠券渠道打开
  @Rule(RuleType.boolean().required())
  shareOpen: boolean;

  // 用户用优惠券编号 从数组中选一张
  @Rule(RuleType.array().required())
  shareUserRules: GetRulesProbability[];
}

export class AppMchDTO {
  @Rule(RuleType.string().required())
  // 微信商户号
  wxMchId: string;

  @Rule(RuleType.string().required())
  // 微信商户秘钥
  wxMchSecert: string;

  @Rule(RuleType.string().required())
  // 回调地址
  notifyUrl: string;

  @Rule(RuleType.string().required())
  certP12: string;

  @Rule(RuleType.string().required())
  certPem: string;

  @Rule(RuleType.string().required())
  certKey: string;
}

export interface NoticeKeys {
  label: string;
  key: string;
}
export class NoticeDTO {
  @Rule(RuleType.string())
  type?: 'school' | 'community';
  @Rule(RuleType.string().required())
  orderTempId: string;
  @Rule(RuleType.string().required())
  verifyTempId: string;
  @Rule(RuleType.array().required())
  orderKeys: NoticeKeys[];
  @Rule(RuleType.array().required())
  verifyKeys: NoticeKeys[];

  @Rule(RuleType.array().required())
  orderSendKeys: string[];
  @Rule(RuleType.array().required())
  verifySendKeys: string[];
}

export interface OrderCancelRule {
  // 时间范围 0~3分钟
  timeRange: number[];
  price: number;
}
export class ConfigCancelOrderDTO {
  // 用户取消规则
  @Rule(RuleType.array().required())
  userCancelRules: OrderCancelRule[];

  // 骑手取消规则
  @Rule(RuleType.array().required())
  riderCancelRules: OrderCancelRule[];

  @Rule(RuleType.array().required())
  userCancelTips: string[];

  @Rule(RuleType.array().required())
  adminCancelTips: string[];

  @Rule(RuleType.array().required())
  agentCancelTips: string[];

  @Rule(RuleType.array().required())
  riderCancelTips: string[];
}

export class ConfigOrderFeeDTO {
  //小费
  @Rule(RuleType.array().required())
  feeTips: number[];

  // 平台收取比例
  @Rule(RuleType.number().required())
  platformExtract: number;

  // 代理收取比例
  @Rule(RuleType.number().required())
  agentExtract: number;
}

export class ConfigOrderReceiveDTO {
  @Rule(RuleType.string().required())
  mode: 'manual' | 'auto' | 'ai';
}

export class ConfigGuideDTO {
  @Rule(RuleType.string().required())
  content: string;
}

export class ConfigCashDTO {
  // @Rule(RuleType.string().required())
  // minCash: number;

  // @Rule(RuleType.string().required())
  // maxCash: number;

  // @Rule(RuleType.string().required())
  // dailyCashLimit: number;
  @Rule(RuleType.boolean().required())
  useCash: boolean;
}

export interface CashOptions {
  type: 'handle' | 'auto';
  open: boolean;
}

export class ConfigCashSettingDTO {
  @Rule(RuleType.object().required())
  alipay: CashOptions;

  @Rule(RuleType.object().required())
  weixin: CashOptions;

  @Rule(RuleType.object().required())
  bank: CashOptions;
}

export class ConfigShareDTO {
  @Rule(RuleType.string().required())
  title: string;

  @Rule(RuleType.string().empty(''))
  path?: string;

  @Rule(RuleType.string().empty(''))
  imageUrl?: string;

  @Rule(RuleType.string().empty(''))
  desc?: string;
}

export class ConfigIntegralDTO {
  @Rule(RuleType.number())
  withIntegral: number;
}

export class ConfigVkeyDTO {
  @Rule(RuleType.string().required())
  vkey: string;
}

export class ConfigCorwxDTO {
  @Rule(RuleType.string().required())
  corpid: string;

  @Rule(RuleType.string().required())
  corpsecret: string;

  @Rule(RuleType.string().empty(''))
  verifyChatid?: string; // 审核群聊Id
}

export class ConfigProtocolDTO {
  @Rule(RuleType.string().empty(''))
  userGuide: string;

  @Rule(RuleType.string().empty(''))
  loginAgreement: string;

  @Rule(RuleType.string().empty(''))
  takerGuide: string;

  @Rule(RuleType.string().empty(''))
  takerAgreement: string;
}

export class ConfigSubscribeDTO {
  // 订单完成
  @Rule(RuleType.string().required())
  orderComplete: string;
  @Rule(RuleType.array().required())
  orderCompleteKeys: string[];

  // 订单取消
  @Rule(RuleType.string().required())
  orderCancel: string;
  @Rule(RuleType.array().required())
  orderCancelKeys: string[];

  // 订单接单
  @Rule(RuleType.string().required())
  orderReceive: string;
  @Rule(RuleType.array().required())
  orderReceiveKeys: string[];

  // 审核结果
  @Rule(RuleType.string().required())
  verifyResult: string;
  @Rule(RuleType.array().required())
  verifyResultKeys: string[];
}

export class ConfigAlipaySubscribeDTO extends PickDto(ConfigSubscribeDTO, [
  'orderComplete',
  'orderCancel',
  'orderReceive',
  'verifyResult',
]) {}

export class ConfigAdminSettingDTO {
  @Rule(RuleType.string().required())
  systemName: string;

  @Rule(RuleType.string().required())
  companyName: string;

  @Rule(RuleType.string().required())
  recordNo: string;

  @Rule(RuleType.string().required())
  logo: string;
}

export class ConifgSetOrderTypeDTO {
  // -1
  @Rule(RuleType.boolean().required())
  close: boolean;

  // -2
  @Rule(RuleType.boolean().required())
  cancel: boolean;

  // 1
  @Rule(RuleType.boolean().required())
  pay: boolean;

  // 2
  @Rule(RuleType.boolean().required())
  take: boolean;

  // 3
  @Rule(RuleType.boolean().required())
  send: boolean;

  // 4
  @Rule(RuleType.boolean().required())
  complete: boolean;
}

export class TimeDescriptionDTO {
  @Rule(RuleType.string().required())
  timeLabel: string;
  @Rule(RuleType.number().required())
  timeValue: number;
}
export class TimeRequirementDTO {
  @Rule(TimeDescriptionDTO)
  timeRequirements: TimeDescriptionDTO[];
}

export class PrintConfigDTO {
  // 打印店的订单
  @Rule(RuleType.boolean().required())
  printOpen: boolean;
  @Rule(RuleType.string().empty(''))
  appId: string;
  @Rule(RuleType.string().empty(''))
  appKey: string;

  // 外卖订单
  @Rule(RuleType.boolean().required())
  shopOpen: boolean;

  // 代理订单 不放到大厅的会出纸
  @Rule(RuleType.boolean().required())
  agentOpen: boolean;

  @Rule(RuleType.string().required())
  platformName: string;
}
