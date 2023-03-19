export interface ServiceData {
  nanoid: string;
  type: string;
  label: string;
  image: string;
  serviceTempNo?: string;
  extractForPlatform?: number; // 平台抽点
  extractForAgent?: number; // 代理抽点
  link?: string;
  intoHall?: boolean;
  express?: any[];
  tags?: string[];
  weightRules?: Rule[];
}
interface Rule {
  gt: number;
  lte: number;
  unit?: number;
  price: number;
}
export interface ServiceObject {
  iconInWhere: string;
  sortStyle: string; // 排序方式
  services: ServiceData[];
}

export interface TakeOutSetting {
  distanceRules: Rule[];
  timeRules: Rule[];
  intoHall: boolean;
  startPrice: number;
  plateformRate: number;
  agentRate: number;
}
