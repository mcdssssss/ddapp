<template>
  <view class="taker-status">
    <view :class="['taker-bg  flex flex-center', bg]">
      <view class="text-center mt-80">
        <view :class="['iconfont', icon]"></view>
        <view class="fo-28 fo-w mt-30">{{ status }}</view>
      </view>
      <image class="taker-bg-image" src="@/static/lines.png"></image>
    </view>
    <view class="p-60">
      <view class="text-center fo-28 bold">{{ statusText }}</view>
      <view v-if="info.status === -1" class="fo-24 mt-30 fo-9 text-center">{{
        info.refuseMsg
      }}</view>
      <view v-if="info.status === 0" class="fo-24 mt-30 fo-9 text-center"
        >预计1~3个工作日内完成审核。审核结果会通知到您的手机。</view
      >

      <view class="mt-60 flex flex-center">
        <DButton
          v-if="info.status === 1"
          height="80rpx"
          width="400rpx"
          @click="navTo('/pages/mine/taker/charge')"
          >查看手续费</DButton
        >
        <DButton
          v-if="info.status === -1"
          height="80rpx"
          width="400rpx"
          @click="redirectTo('/pages/mine/taker/register')"
          >修改信息</DButton
        >
      </view>
    </view>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
import { takerInfo } from "@/utils/api";
export default Vue.extend({
  data() {
    return {
      bgColor: "#4facfe",
      icon: "icon-question",
      bg: "taker-bg-wait",
      statusText: "提交成功,请等待管理员审核！",
      info: {},
      status: "审核中",
    };
  },
  onLoad() {
    uni.setNavigationBarTitle({
      title: "",
    });
    uni.setNavigationBarColor({
      backgroundColor: this.bgColor,
      frontColor: "#ffffff",
    });
    this.getInfo();
  },
  methods: {
    navTo(path: string) {
      uni.navigateTo({
        url: path,
      });
    },
    redirectTo(path: string) {
      uni.redirectTo({
        url: path,
      });
    },

    async getInfo() {
      uni.showLoading({ title: "检测中" });
      const result = await takerInfo();
      uni.hideLoading();
      if (result.code === 200 && result.data) {
        this.info = result.data;
        if (result.data.status === 0) {
          this.bgColor = "#4facfe";
          this.statusText = "提交成功,请等待管理员审核！";
          this.bg = "taker-bg-wait";
          this.icon = "icon-question";
          this.status = "审核中";
        } else if (result.data.status === 1) {
          this.bgColor = "#43e97b";
          this.statusText = "恭喜,您已通过审核！";
          this.bg = "taker-bg-success";
          this.icon = "icon-true";
          this.status = "审核成功";
        } else {
          this.bgColor = "#ff0844";
          this.statusText = "抱歉,您的审核未通过！";
          this.bg = "taker-bg-error";
          this.icon = "icon-false";
          this.status = "审核失败";
        }
        uni.setNavigationBarColor({
          backgroundColor: this.bgColor,
          frontColor: "#ffffff",
        });
      }
    },
  },
});
</script>
<style lang="scss" scoped>
.taker-status {
  .taker-bg {
    height: 500rpx;
    position: relative;
    .taker-bg-image {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 750rpx;
      height: 114rpx;
    }
    .iconfont {
      font-size: 60rpx;
      color: #ffffff;
      height: 120rpx;
      width: 120rpx;
      text-align: center;
      line-height: 120rpx;
      border: 4rpx solid #ffffff;
      border-radius: 120rpx;
    }
  }
  .taker-bg-success {
    background-image: linear-gradient(to bottom, #43e97b 0%, #38f9d7 100%);
  }
  .taker-bg-wait {
    background-image: linear-gradient(to bottom, #4facfe 0%, #00f2fe 100%);
  }
  .taker-bg-error {
    background-image: linear-gradient(to bottom, #ff0844 0%, #ffb199 100%);
  }
}
</style>
