import { $get } from "./request";
import Store from "../store";
import { API } from "./constrants";
/**
 * 获取位置
 * @returns
 */
export const getLocation = async (): Promise<{
  code: boolean;
  latitude?: number;
  longitude?: number;
}> => {
  // const provider = await getProvider();

  return new Promise((resolve: Function) => {
    uni.getLocation({
      type: "gcj02",
      complete: (res) => {
        if (res.errMsg === "getLocation:ok") {
          resolve({
            code: true,
            latitude: res.latitude,
            longitude: res.longitude,
          });
        } else {
          resolve({ code: false });
        }
      },
    });
  });
};

// 获取当前端
export const getProvider = async () => {
  return new Promise((resolve) => {
    uni.getProvider({
      service: "oauth",
      complete(res) {
        resolve(res.provider[0]);
      },
    });
  });
};

export const login = () => {
  return new Promise((resolve) => {
    uni.getProvider({
      service: "oauth",
      complete: (res) => {
        const provider = res.provider[0];
        uni.setStorageSync("provider", provider);
        uni.login({
          provider,
          success: async (res) => {
            if (provider === "weixin") {
              const result = await $get(
                "wxapp/login",
                {
                  code: res.code,
                },
                false
              );
              if (result.code === 200) {
                uni.setStorageSync("wxappNo", result.data.wxappNo);
                if (result.data.user) {
                  uni.setStorageSync("userInfo", result.data.user);
                  Store.commit("setProfile", result.data.user);
                }
                resolve(result.data.wxappNo);
              } else {
                resolve(false);
              }
            } else if (provider === "alipay") {
              const result = await $get(
                "alipay/login",
                {
                  code: res.code,
                },
                false
              );
              if (result.code === 200) {
                uni.setStorageSync("aliappNo", result.data.aliappNo);
                if (result.data.user) {
                  uni.setStorageSync("userInfo", result.data.user);
                  Store.commit("setProfile", result.data.user);
                }
                resolve(result.data.aliappNo);
              } else {
                resolve(false);
              }
            } else if (provider === "qq") {
              const result = await $get(
                "qq/login",
                {
                  code: res.code,
                },
                false
              );
              if (result.code === 200) {
                uni.setStorageSync("qqappNo", result.data.qqappNo);
                if (result.data.user) {
                  uni.setStorageSync("userInfo", result.data.user);
                  Store.commit("setProfile", result.data.user);
                }
                resolve(result.data.qqappNo);
              } else {
                resolve(false);
              }
            } else if (provider === "toutiao") {
              const result = await $get(
                "toutiao/login",
                {
                  code: res.code,
                },
                false
              );
              if (result.code === 200) {
                uni.setStorageSync("ttappNo", result.data.ttappNo);
                if (result.data.user) {
                  uni.setStorageSync("userInfo", result.data.user);
                  Store.commit("setProfile", result.data.user);
                }
                resolve(result.data.wxappNo);
              } else {
                resolve(false);
              }
            } else {
              resolve(false);
            }
          },
        });
      },
    });
  });
};

export const getServicePath = (type: string) => {
  let path = "";
  switch (type) {
    case "print":
      path = "/pages/service/print/print";
      break;
    case "errands":
      path = "/pages/service/errands/errands";
      break;
    case "move":
      path = "/pages/service/move/move";
      break;
    case "clear":
      path = "/pages/service/clear/clear";
      break;
    case "play":
      path = "/pages/service/play/play";
      break;
    case "repair":
      path = "/pages/service/repair/repair";
      break;
    case "software":
      path = "/pages/service/software/software";
      break;
    case "activity":
      path = "/pages/service/activity/activity";
      break;
    case "express":
      path = "/pages/service/express/express";
      break;
  }
  return path;
};

// 居中裁剪
export const imageCenterCrop = (
  url: string,
  width: number,
  height: number,
  quality = 90
) => {
  if (!url) {
    return url;
  }
  return `${url}?x-oss-process=image/auto-orient,1/resize,m_fill,w_${width},h_${height}/quality,q_${quality}`;
};

export const formatDate = (date: string | number, fmt: string) => {
  const d = new Date(date);
  const o = {
    "M+": d.getMonth() + 1, //月份
    "d+": d.getDate(), //日
    "h+": d.getHours(), //小时
    "m+": d.getMinutes(), //分
    "s+": d.getSeconds(), //秒
    "q+": Math.floor((d.getMonth() + 3) / 3), //季度
    S: d.getMilliseconds(), //毫秒
  } as any;
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (d.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (const k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return fmt;
};

/**
 * 上传文件
 * @param filePath
 * @returns
 */
export const upload = async (filePath: string, perfix?: string) => {
  return new Promise((resolve) => {
    uni.uploadFile({
      url: API() + "upload/put",
      filePath,
      fileType: "image",
      name: "file",
      formData: {
        perfix,
      },
      header: {
        "x-perfix": perfix || "pic/",
      },

      complete(e: any) {
        if (e.statusCode === 200 || e.statusCode === "200") {
          const json = JSON.parse(e.data) as any;
          if (json.code === 200) {
            resolve(json.data);
          } else {
            uni.showToast({
              icon: "none",
              title: json.msg,
            });
            resolve("");
          }
        } else {
          uni.showToast({
            icon: "none",
            title: "上传图片失败",
          });
          resolve("");
        }
      },
    });
  });
};

export const requestSubscribe = async (tempIds: string[]) => {
  if (tempIds.length === 0) {
    return;
  }
  const provider = await getProvider();
  return new Promise((resolve) => {
    if (provider === "weixin") {
      uni.requestSubscribeMessage({
        tmplIds: tempIds,
        complete() {
          resolve(true);
        },
      });
    } else if (provider === "alipay") {
      (my as any).requestSubscribeMessage({
        //需要用户订阅的消息模板的id的集合
        entityIds: tempIds,
        success: () => {
          // res.behavior=='subscribe'
          resolve(true);
        },
        fail: () => {
          resolve(false);
        },
      });
    } else {
      resolve(false);
    }
  });
};
