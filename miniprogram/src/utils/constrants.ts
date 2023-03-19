const env = process.env.NODE_ENV;
export const API = () => {
  if (env === "local") {
    return "http://localhost:8001/api/";
  } else if (env === "development") {
    return "http://api.test.malimawai.cn/api/";
  } else if (env === "prod") {
    return "https://op.ddrun.malimawai.cn/api/";
  }
  return "https://op.ddrun.malimawai.cn/api/";
};
export const SCHOOL_TYPE = "school" as "school" | "community"; // or community

export const AUTOCANCELTIME = 15 * 60 * 1000;
export interface SchoolAddressOptions {
  area: string;
  areaId: number;
  build: string;
  buildId: number;
  detail: string;
}

// 发布的地址Interface
export interface PublishAddressInterface {
  noneText?: string; // 无地址展示的内容
  schoolNo?: string;
  contactName?: string;
  mobileNumber?: string;
  province?: string;
  city?: string;
  district?: string;
  detail?: string;
  latitude?: string;
  longitude?: string;
  schoolBuild?: SchoolAddressOptions;
}

export type StatusType =
  | "all"
  | "waitPay"
  | "waitTake"
  | "waitSuccess"
  | "complete";
export type OrderTypeType = "user" | "taker";
