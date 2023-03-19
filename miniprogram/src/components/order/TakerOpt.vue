<template>
  <view v-if="status !== 4 && status !== 0 && status !== -1 && status !== -2">
    <view class="order-bottom-bar flex flex-between item-center">
      <view class="flex flex-start item-center">
        <!-- <DButton
          ma="ml-20"
          v-if="
            status === 2 &&
            (mchStatus === -2 || mchStatus === 0) &&
            myTakeNo === takerNo
          "
          radius
          @click="clickCancel()"
          >取消订单</DButton
        > -->
      </view>
      <view class="flex flex-end item-center">
        <DButton
          ma="mr-20"
          v-if="status === 1 && !self"
          type="success"
          radius
          @click="clickHelp()"
          >帮助TA</DButton
        >

        <DButton
          ma="mr-20"
          v-if="status === 2 && takerNo === myTakeNo"
          type="info"
          radius
          @click="takerGetd()"
          >任务完成</DButton
        >
        <DButton
          ma="mr-20"
          v-if="status === 3 && takerNo === myTakeNo"
          type="info"
          radius
          @click="clickComplete()"
          >确认完成</DButton
        >
      </view>
    </view>
    <view style="height: 120rpx"></view>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
import {
  orderTakerGetd,
  orderTakerComplete,
  orderTaker,
  canITaker,
  orderTakerGetdByMch,
  orderTakerMch,
} from "@/utils/api";
export default Vue.extend({
  props: {
    status: {
      type: Number,
      default: 0,
    },
    mchStatus: {
      type: Number,
      default: 0,
    },
    no: {
      type: String,
      default: "",
    },
    mchTakerNo: {
      type: String,
      default: "",
    },
    takerNo: {
      type: String,
      default: "",
    },
    // 打印订单是否到店自取
    self: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      myTakeNo: uni.getStorageSync("takerNo"),
    };
  },
  methods: {
    async takerGetd() {
      uni.showLoading({
        title: "操作中",
      });
      const result = await orderTakerGetd({ orderNo: this.no });
      uni.hideLoading();
      if (result.code === 200) {
        this.$emit("refresh");
      }
    },
    async takerGetdBymch() {
      uni.showModal({
        title: "提示",
        content: "是否已制作完成？",
        success: async (res) => {
          if (res.confirm) {
            uni.showLoading({ title: "请稍等" });
            const result = await orderTakerGetdByMch({ orderNo: this.no });
            uni.hideLoading();
            if (result.code === 200) {
              this.$emit("refresh");
            }
          }
        },
      });
    },

    clickComplete() {
      uni.showModal({
        title: "提示",
        content: "请确保任务已完成，是否确认完成？",
        success: async (res) => {
          if (res.confirm) {
            uni.showLoading({ title: "请稍等" });
            const result = await orderTakerComplete({ orderNo: this.no });
            uni.hideLoading();
            if (result.code === 200) {
              this.$emit("refresh");
            }
          }
        },
      });
    },

    async mchTake() {
      let taker = uni.getStorageSync("takerNo");
      if (!taker) {
        const result = await canITaker();
        if (result.code === 200 && result.data) {
          uni.setStorageSync("takerNo", result.data);
          taker = result.data;
        }
      }
      if (!taker) {
        uni.showModal({
          title: "提示",
          content: "您还没有成为接单员，是否前往申请？",
          confirmText: "立即前往",
          success: (res) => {
            if (res.confirm) {
              uni.navigateTo({
                url: "/pages/mine/taker/register",
              });
            }
          },
        });
        return;
      }

      if (taker !== this.mchTakerNo) {
        uni.showToast({
          title: "您无权接单",
          icon: "none",
        });
        return;
      }
      uni.showModal({
        title: "提示",
        content: "确定要接此单？",
        success: async (res) => {
          if (res.confirm) {
            uni.showLoading({ title: "接单中" });
            const result = await orderTakerMch({ orderNo: this.no });
            uni.hideLoading();
            if (result.code === 200) {
              uni.showToast({ title: result.msg, icon: "success" });
              this.$emit("refresh");
            }
          }
        },
      });
    },

    async clickHelp() {
      const userInfo = uni.getStorageSync("userInfo");
      if (!userInfo) {
        uni.navigateTo({
          url: "/pages/login/login",
        });
        return;
      }

      let taker = uni.getStorageSync("takerNo");
      if (!taker) {
        const result = await canITaker();
        if (result.code === 200 && result.data) {
          uni.setStorageSync("takerNo", result.data);
          taker = result.data;
        }
      }

      if (!taker) {
        uni.showModal({
          title: "提示",
          content: "您还没有成为接单员，是否前往申请？",
          confirmText: "立即前往",
          success: (res) => {
            if (res.confirm) {
              uni.navigateTo({
                url: "/pages/mine/taker/register",
              });
            }
          },
        });
        return;
      }

      uni.showModal({
        title: "提示",
        content: "确定要接此单？",
        success: async (res) => {
          if (res.confirm) {
            uni.showLoading({ title: "接单中" });
            const result = await orderTaker({ orderNo: this.no });
            uni.hideLoading();
            if (result.code === 200) {
              uni.showToast({ title: result.msg, icon: "success" });
              this.$emit("refresh");
            }
          }
        },
      });
    },
  },
});
</script>
<style lang="scss" scoped>
.order-bottom-bar {
  height: 120rpx;
  width: 750rpx;
  background-color: #ffffff;
  position: fixed;
  bottom: 0;
  left: 0;
  box-shadow: 0 0 10rpx 0 rgba(0, 0, 0, 0.1);
}
</style>
