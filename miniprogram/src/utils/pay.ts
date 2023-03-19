export const pay = (
  data: {
    timeStamp: string;
    nonce_str: string;
    prepay_id: string;
    paySign: string;
    orderNo: string;
    tradeNo?: string;
  },
  type?: string
) => {
  // 调起支付
  uni.getProvider({
    service: "payment",
    complete: (res) => {
      if (res.errMsg === "getProvider:ok") {
        const provider = res.provider[0];
        if (provider === "wxpay") {
          uni.requestPayment({
            provider,
            orderInfo: JSON.stringify({
              tradeNO: data.tradeNo,
            }),
            timeStamp: data.timeStamp,
            nonceStr: data.nonce_str,
            package: "prepay_id=" + data.prepay_id,
            signType: "MD5",
            paySign: data.paySign,
            complete: (res) => {
              if (res.errMsg === "requestPayment:fail cancel") {
                uni.showToast({
                  title: "支付取消",
                  icon: "none",
                  duration: 800,
                });
              } else {
                uni.showToast({
                  title: "支付成功",
                  icon: "success",
                  duration: 800,
                });
              }
              payRedirct(data.orderNo, type);
            },
          });
        } else if (provider === "alipay") {
          (my as any).tradePay({
            // 调用统一收单交易创建接口（alipay.trade.create），获得返回字段支付宝交易号trade_no
            tradeNO: data.tradeNo,
            success: (res: any) => {
              if (res.resultCode === "9000") {
                uni.showToast({
                  title: "支付成功",
                  icon: "success",
                  duration: 800,
                });
              } else {
                uni.showToast({
                  title: "支付取消",
                  icon: "none",
                  duration: 800,
                });
              }
            },
            fail: () => {},
            complete: () => {
              payRedirct(data.orderNo, type);
            },
          });
        }
      }
    },
  });
};

export const payRedirct = (orderNo: string, type?: string) => {
  let url = "/pages/order/detail?orderNo=" + orderNo;
  const timeout = setTimeout(() => {
    if (type === "activity") {
      url = "/pages/plugins/activity/order/detail?orderNo=" + orderNo;
    }
    uni.redirectTo({
      url,
    });
    clearTimeout(timeout);
  }, 800);
};
