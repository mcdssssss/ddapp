<template>
  <view class="login flex flex-center item-center">
    <view class="p-30">
      <view class="text-center fo-50" style="margin-bottom: 160rpx">
        手机号码登录/注册
      </view>
      <button
        class="login-btn"
        open-type="getPhoneNumber"
        @getphonenumber="getPhoneNumber"
      >
        一键登录/注册
      </button>
      <view
        v-if="provider !== 'qq'"
        class="mt-25 text-center fo-28 login-text"
        @click="redrictToPhone"
      >
        手机短信验证登录/注册
      </view>
    </view>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
import { wxappRegister, alipayRegister } from "@/utils/api";
export default Vue.extend({
  data() {
    return {
      provider: uni.getStorageSync("provider"),
    };
  },
  mounted() {
    uni.hideLoading();
    uni.setNavigationBarTitle({
      title: "",
    });
  },
  methods: {
    async getPhoneNumber(event: any) {
      const provider = uni.getStorageSync("provider");
      if (event.detail.errMsg === "getPhoneNumber:ok") {
        if (provider === "weixin") {
          const { code } = event.detail;
          const result = await wxappRegister({
            code,
            fromNo: this.$store.state.school.schoolNo,
            shareUserNo: uni.getStorageSync("shareUserNo") || "",
          });
          if (result.code === 200) {
            uni.setStorageSync("userInfo", result.data);
            uni.navigateBack({
              delta: 1,
            });
          }
        } else if (provider === "alipay") {
          const { encryptedData } = event.detail;
          const result = await alipayRegister({
            encryptedData,
            fromNo: this.$store.state.school.schoolNo,
            shareUserNo: uni.getStorageSync("shareUserNo") || "",
          });
          if (result.code === 200) {
            uni.setStorageSync("userInfo", result.data);
            uni.navigateBack({
              delta: 1,
            });
          }
        } else if (provider === "toutiao") {
          console.log("provider,event");
        }
      } else {
        uni.showToast({
          title: "小程序权限不足",
          icon: "none",
        });
      }
    },
    redrictToPhone() {
      uni.redirectTo({
        url: "/pages/login/phone/phone",
      });
    },
  },
});
</script>
<style lang="scss" scoped>
.login {
  width: 100vw;
  height: 90vh;
  .login-btn {
    width: 630rpx;
    height: 100rpx;
    line-height: 100rpx;
    background-color: #333;
    color: #ffffff;
    margin: auto;
    &:active {
      opacity: 0.8;
    }
  }
}
.login-text {
  color: $info;
}
</style>
