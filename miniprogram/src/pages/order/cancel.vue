<template>
  <view class="p-30">
    <view class="fo-50"> 请选择一个理由 </view>
    <view v-if="cancelTip" class="mt-25 fo-28 fo-9">
      {{ cancelTip }}
    </view>
    <radio-group>
      <view
        v-for="(item, index) in type === 'taker'
          ? takerCancelTips
          : type === 'user'
          ? userCancelTips
          : mchCancelTips"
        :key="index"
        class="p-30 flex flex-between item-center border-b-none"
        @click="current = index"
      >
        <view class="fo-28 fo-3">
          {{ item }}
        </view>
        <radio :checked="index === current" />
      </view>
      <view>
        <view
          key="other"
          class="p-30 flex flex-between item-center"
          @click="current = -2"
        >
          <view class="fo-28 fo-3"> 其他 </view>
          <radio :checked="current === -2" />
        </view>
        <input
          class="reason"
          :disabled="current !== -2"
          type="text"
          placeholder="请输入取消理由"
          v-model="otherReason"
        />
      </view>
    </radio-group>
    <view class="mt-30">
      <DButton type="theme" height="100rpx" @click="submit()"
        >提交理由并取消</DButton
      >
      <!-- <ClassBtn label="提交理由并取消" @click="submit"></ClassBtn> -->
    </view>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import {
  getReason,
  getCancelTip,
  orderCancel,
  orderMchCancel,
  orderTakerCancel,
} from "@/utils/api";
export default Vue.extend({
  data() {
    return {
      cancelTip: "",
      userCancelTips: [],
      takerCancelTips: [],
      mchCancelTips: [],
      current: -1,
      otherReason: "",
      type: "",
      orderNo: "",
    };
  },
  onLoad(options: { orderNo: string; type: "taker" | "user" | "mch" }) {
    this.orderNo = options.orderNo;
    this.type = options.type;
    this.getSeason();
    this.getTip();
  },
  methods: {
    async getSeason() {
      uni.showLoading({ title: "加载中" });
      const res = await getReason({ schoolNo: uni.getStorageSync("schoolNo") });
      uni.hideLoading();
      if (res.code === 200 && res.data) {
        this.userCancelTips = res.data.userCancelTips;
        this.takerCancelTips = res.data.takerCancelTips;
        this.mchCancelTips = res.data.mchCancelTips;
      }
    },
    async getTip() {
      const res = await getCancelTip({
        orderNo: this.orderNo,
        cancelBy: this.type,
      });
      if (res.code === 200) {
        this.cancelTip = res.data;
      }
    },
    async submit() {
      if (this.current === -1) {
        uni.showToast({
          icon: "none",
          title: "请选择一个理由",
        });
        return;
      } else if (this.current === -2 && this.otherReason === "") {
        uni.showToast({
          icon: "none",
          title: "请输入其他理由",
        });
        return;
      }
      let cancelReason = "";
      if (this.current === -2) {
        cancelReason = "其他:" + this.otherReason;
      } else {
        if (this.type === "taker") {
          cancelReason = this.takerCancelTips[this.current];
        } else if (this.type === "user") {
          cancelReason = this.userCancelTips[this.current];
        } else {
          cancelReason = this.mchCancelTips[this.current];
        }
      }
      uni.showLoading({
        title: "取消中",
      });
      let res = undefined;
      if (this.type === "taker") {
        res = await orderTakerCancel({ orderNo: this.orderNo, cancelReason });
      } else if (this.type === "user") {
        res = await orderCancel({ orderNo: this.orderNo, cancelReason });
      } else {
        res = await orderMchCancel({ orderNo: this.orderNo, cancelReason });
      }
      uni.hideLoading();
      if (res.code === 200) {
        const pages = getCurrentPages();
        const currentPage = pages[pages.length - 2] as any;
        currentPage.$vm.getInfo(this.orderNo);
        uni.navigateBack({
          delta: 1,
        });
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.reason {
  width: 630rpx;
  height: 80rpx;
  background-color: #f3f3f3;
  border-radius: 8rpx;
  padding: 0 30rpx;
}
</style>
