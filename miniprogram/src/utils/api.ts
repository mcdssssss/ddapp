import { PublishAddressInterface } from "./constrants";
import { $get, del, post, put } from "./request";

export interface SelectQuery {
  current: number;
  pageSize: number;
}

export interface SchoolAddress {
  area: string;
  areaId: number;
  build: string;
  buildId: number;
  detail: string;
}

export interface Address {
  province: string;
  city: string;
  district: string;
  latitude: number;
  longitude: number;
  detail?: string;
  contactName: string;
  mobileNumber: string;
  schoolBuild?: SchoolAddress;
}

export interface Publish {
  startAddress: PublishAddressInterface;
  endAddress: PublishAddressInterface;
  serviceNanoid: string;
  fee: number | "";
  remarks: string;
  serviceDetails: any;
  userCouponId: number;
  deadlineTime: number;
}

export const getSchoolList = (data: {
  latitude?: number;
  longitude?: number;
  notIn?: string;
  keyword?: string;
  current: number;
  pageSize: number;
}) => $get("baseapp/school/list", data, false);

export const getSchoolListByLocation = (data: {
  latitude?: number;
  longitude?: number;
}) => $get("baseapp/school/list/location", data, false);

export const getSchoolInfo = () => $get("baseapp/school/info", {});

export const getSiteAlways = (data: { schoolNo: string; id?: number }) =>
  $get("baseapp/print/site/always", data);

export const getSiteList = (
  data: {
    schoolNo: string;
    keyword?: string;
  } & SelectQuery
) => $get("baseapp/print/site/list", data);

export const getSchoolAddress = () => $get("baseapp/school/address", {});

export const mapLocation = (data: { latitude: number; longitude: number }) =>
  $get("map/location", data);

export const addressAdd = (data: Address) => post("baseapp/address/add", data);

export const addressUpdate = (
  data: Address & {
    addressNo: string;
  }
) => put("baseapp/address/update", data);

export const addressDel = (data: { addressNo: string }) =>
  del("baseapp/address/del", data);

export const addressList = (data: SelectQuery) =>
  $get("baseapp/address/list", data);

export const addressInfo = (data: { addressNo: string }) =>
  $get("baseapp/address/info", data);

export const calculate = (data: Publish) =>
  post("baseapp/publish/calculate", data);

export const publish = (data: Publish) => post("baseapp/publish", data);

export const payAgain = (data: { orderNo: string }) =>
  post("baseapp/publish/payagain", data);

export const fetchCouponList = (data: { price?: number }) =>
  $get("coupon/list", data);

/**
 * 订单列表
 * @param data
 * @returns
 */
export const fetchOrderList = (
  data: {
    orderType: "user" | "taker";
    status: "all" | "waitPay" | "waitTake" | "waitSuccess" | "complete";
  } & SelectQuery
) => $get("baseapp/order/list", data);

export const fetchOrderSchoolList = (
  data: { orderType: string } & SelectQuery
) => $get("baseapp/order/school/list", data);

export const fetchOrderInfo = (data: { orderNo: string }) =>
  $get("baseapp/order/info", data);

export const orderTaker = (data: { orderNo: string }) =>
  post("baseapp/order/take", data);

export const fetchSchoolCarousel = () =>
  $get("baseapp/school/carousel/info", {});

export const orderTakerGetd = (data: { orderNo: string }) =>
  post("baseapp/order/taker/getd", data);
export const orderTakerGetdByMch = (data: { orderNo: string }) =>
  post("baseapp/order/mch/getd", data);

export const orderTakerMch = (data: { orderNo: string }) =>
  post("baseapp/order/take/mch", data);

export const orderCancel = (data: { orderNo: string; cancelReason?: string }) =>
  post("baseapp/order/cancel", data);

export const orderTakerCancel = (data: {
  orderNo: string;
  cancelReason?: string;
}) => post("baseapp/order/taker/cancel", data);

export const orderMchCancel = (data: {
  orderNo: string;
  cancelReason?: string;
}) => post("baseapp/order/mch/cancel", data);

export const orderComplete = (data: { orderNo: string }) =>
  post("baseapp/order/complete", data);

export const orderTakerComplete = (data: { orderNo: string }) =>
  post("baseapp/order/taker/complete", data);

// 是否是taker
export const canITaker = () => $get("baseapp/taker/canitaker", {});

export const getReason = (data: { schoolNo: string }) =>
  $get("baseapp/school/reason", data);

export const getCancelTip = (data: { orderNo: string; cancelBy: string }) =>
  $get("baseapp/order/cancel/tip", data);

export const takerRegister = (data: {
  realName: string;
  idCard: string;
  cardImages: any;
}) => post("baseapp/taker/register", data);

export const takerInfo = () => $get("baseapp/taker/info", {});

export const wxappRegister = (data: {
  code: string;
  fromNo?: string;
  shareUserNo?: string;
}) => post("wxapp/register", data);

export const alipayRegister = (data: {
  encryptedData: string;
  fromNo?: string;
  shareUserNo?: string;
}) => post("alipay/register", data);

export const userRegister = (data: {
  mobileNumber: string;
  verifyCode: string;
  fromNo?: string;
  shareUserNo?: string;
}) => post("user/register", data);

export const smsCode = (data: { mobileNumber: string }) =>
  post("sms/code", data);

export const userInfo = () => $get("user/info", {});

export const userUpdate = (data: {
  avatarUrl?: string;
  nickName?: string;
  gender?: number;
  province?: string;
  city?: string;
  area?: string;
}) => post("user/update", data);

// 获取配置
export const configProtocol = () => $get("baseapp/config/protocol", {});
// 获取订阅消息模板id
export const configSubscribe = (data: { provider: string }) =>
  $get("baseapp/config/subscribe", data);

export const richtextInfo = (data: { richNo: string }) =>
  $get("baseapp/richtext/info", data);

export const takerAnlysis = () => $get("baseapp/taker/analysis", {});
export const getBalance = () => $get("baseapp/cash/blance", {});
export const cashRegister = (data: { amount: number; bankNo: string }) =>
  post("baseapp/cash/register", data);

export const cashList = (data: { current: number; pageSize: number }) =>
  $get("baseapp/cash/list", data);

export const bankList = (data: { current: number; pageSize: number }) =>
  $get("bank/list", data);
export const bankDel = (data: { bankNo: string }) => post("bank/del", data);
export const bankAdd = (data: {
  realname: string;
  cardNo: string;
  bankName: string;
}) => post("bank/add", data);
export const bankUpdate = (data: {
  realname: string;
  cardNo: string;
  bankName: string;
  bankNo: string;
}) => put("bank/update", data);

export const readCoupon = (data: { ids: number[] }) => put("coupon/read", data);
export const bankVerify = () => $get("bank/verifyinfo", {});

export const getRequirement = () => $get("baseapp/config/time/requirement", {});
