export interface ResultResponse {
  code: number;
  msg: string;
  data: any;
}

/**
 * 公众号配置
 */
export interface ConfigWxoa {
  appId: string;
  appsecret: string;
  token: string;
}
export interface ConfigJWT {
  privateKey: string; //秘钥
  expiresIn: string; // 过期时间
}

/**
 * 阿里云配置
 */
export interface ConfigAli {
  accessKeyId: string;
  accessKeySecret: string;
  // 角色ARN 文档地址 https://help.aliyun.com/document_detail/100624.htm?spm=a2c4g.11186623.0.0.75565b78xKNESY#concept-xzh-nzk-2gb
  arn: string;
  oss: {
    region: string;
    bucket: string;
  };
}
/**
 * 自定义配置
 */
export interface CustomConfig {
  wxoa: ConfigWxoa;
  jwt: ConfigJWT;
  ali: ConfigAli;
}

export interface RuleWeight {
  // 单位 g克
  gt: number; // 大于
  lte: number; // 小于等于
  unitWeight: number; // 每多少g
  price: number; // 价格
}

export interface RuleDistance {
  // 单位 m米
  gt: number; // 大于
  lte: number; // 小于等于
  unitDistance: number; // 每多少米
  price: number; // 价格
}

export interface RuleTime {
  gt: string; // 大于
  lte: string; // 小于等于
  price: number; // 价格
}

export interface ValuationRule {
  distance: RuleDistance[];
  weight: RuleWeight[];
  time: RuleTime[];
}

export type ServerType = 'helpDeliver' | 'helpGet' | 'helpBuy';
export type ServerTypeBySchool =
  | 'print'
  | 'erands'
  | 'clear'
  | 'move'
  | 'play'
  | 'software'
  | 'activity'
  | 'repair';

export type PayType = 'wxpay' | 'alipay' | 'qqpay' | 'other';

// -2取消订单  -1交易关闭 0.待付款  1.已支付/待接单  2.已接单/配送中 3.配送完成/待确认  4.确认完成'
export type OrderType = -2 | -1 | 0 | 1 | 2 | 3 | 4;

// -2无需商家接单 -1 商家取消 0 商家待接单 1 商家已接单 2 商家制作完成
export type SchoolOrderStatusByMch = -2 | -1 | 0 | 1 | 2;
// 0.未发起退款  1.已退款
export type RefundStatus = 0 | 1;

// 由谁点击完成订单
export type OrderCompleteBy = 'admin' | 'agent' | 'user' | 'rider' | 'system';

// 参与人
export type SchoolOrderPersonType =
  | 'admin'
  | 'agent'
  | 'user'
  | 'taker'
  | 'mch'
  | 'system';

// export interface ServicePrint {}
