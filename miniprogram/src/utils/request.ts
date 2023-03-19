import { API, SCHOOL_TYPE } from "./constrants";
import { getProvider, login } from "./common";

export interface responseData {
  code: number;
  msg: string;
  data?: any;
}
export const getNo = async (name: string) => {
  let no = uni.getStorageSync(name);
  if (!no) {
    no = await login();
  }
  return no;
};

export const request = async (
  url: string,
  data: any,
  method:
    | "OPTIONS"
    | "GET"
    | "HEAD"
    | "POST"
    | "PUT"
    | "DELETE"
    | "TRACE"
    | "CONNECT"
    | undefined,
  needNo = true
): Promise<responseData> => {
  const provider = await getProvider();
  const header = {
    "version-name": SCHOOL_TYPE,
  } as any;
  if (provider === "weixin") {
    header.wxappno = needNo ? await getNo("wxappNo") : undefined;
  } else if (provider === "alipay") {
    header.aliappno = needNo ? await getNo("aliappNo") : undefined;
  } else if (provider === "qq") {
    header.qqappno = needNo ? await getNo("qqappNo") : undefined;
  } else if (provider === "toutiao") {
    header.ttappno = needNo ? await getNo("ttappNo") : undefined;
  }
  return new Promise((resolve) => {
    uni.request({
      url: API() + url,
      data,
      method,
      header,
      success: (res: UniApp.RequestSuccessCallbackResult) => {
        if (res.statusCode === 200) {
          const data = res.data as responseData;
          if (data.code !== 200) {
            uni.showToast({
              icon: "none",
              title: data.msg,
            });
          }
          if (data.code === 203) {
            uni.navigateTo({
              url:
                provider === "qq"
                  ? "/pages/login/phone/phone"
                  : "/pages/login/login",
            });
            return;
          }
          resolve(data);
        } else {
          resolve({
            code: 9999,
            msg: "error",
          });
          uni.showToast({
            icon: "none",
            title: "服务端错误",
          });
        }
      },
      fail: (res: UniApp.GeneralCallbackResult) => {
        resolve({
          code: 9999,
          msg: "error",
        });
        uni.showToast({
          icon: "none",
          title: res.errMsg,
        });
      },
    });
  });
};

export const post = (url: string, data: any) => {
  return request(url, data, "POST");
};

export const put = (url: string, data: any) => {
  return request(url, data, "PUT");
};

export const del = (url: string, data: any) => {
  return request(url, data, "DELETE");
};

export const $get = (url: string, data: any, needNo = true) => {
  return request(url, data, "GET", needNo);
};
