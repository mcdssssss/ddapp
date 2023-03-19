<template>
  <view class="order-item" @click="navTo()">
    <view class="flex flex-between item-center">
      <view class="flex flex-start item-center">
        <view class="avatar">
          <image
            class="avatar-image"
            :src="imageCenterCrop(options.avatarUrl, 60, 60)"
            mode="aspectFill"
          ></image>
        </view>
        <DTag ma="ml-15" :type="options.orderType">{{
          options.priceDetails.subTitle
        }}</DTag>
        <DTag ma="ml-15">
          <i class="iconfont icon-naozhong mr-5"></i>
          {{ options.deadlineTime }}截止</DTag
        >
      </view>
      <view class="fo-9 fo-24">{{ options.createTimeLocal }}</view>
    </view>
    <view class="fo-28 fo-9 mt-20">{{ options.priceDetails.desc }}</view>
    <view class="address-bar mt-20">
      <view
        v-if="
          options.priceDetails.distance > 0 || options.priceDetails.weight > 0
        "
        class="fo-24 mb-20"
      >
        <text v-if="options.priceDetails.distance > 0" class="mr-20"
          >相距{{
            options.priceDetails.distance >= 1000
              ? (options.priceDetails.distance / 1000).toFixed(2) + "km"
              : options.priceDetails.distance + "m"
          }}</text
        >
        <text v-if="options.priceDetails.weight > 0"
          >重{{ options.priceDetails.weight }}kg</text
        >
      </view>
      <AddressText
        v-if="options.startAddress.schoolNo || options.startAddress.province"
        type="start"
        margin="0 0 20rpx 0"
        :options="options.startAddress"
      />
      <AddressText
        v-if="options.endAddress.schoolNo || options.endAddress.province"
        type="end"
        :options="options.endAddress"
      />
    </view>

    <view class="flex flex-between item-center mt-20">
      <view class="flex flex-start item-center">
        <view
          class="shang"
          :style="{ width: type === 'taker' ? '40rpx' : '100rpx' }"
          >{{
            type === "taker" ? "赏" : options.status === 0 ? "需付款" : "实付款"
          }}</view
        >
        <view class="fo-price bold fo-28 ml-10"
          >{{ options.totalPrice }}元</view
        >
      </view>

      <DButton
        v-if="
          type === 'taker' &&
          options.mchStatus === 0 &&
          options.status > 0 &&
          isMch &&
          provider !== 'alipay'
        "
        type="success"
        radius
        @click.stop="takeClickByMch"
        >商家接单</DButton
      >
      <DButton
        v-else-if="
          options.status === 1 &&
          type === 'taker' &&
          provider !== 'alipay' &&
          !(
            (options.orderType === 'print' || options.orderType === 'shop') &&
            options.endAddress &&
            options.endAddress.noneText === '到店自取'
          )
        "
        type="success"
        radius
        @click.stop="takeClick"
        >帮助TA</DButton
      >
      <DButton
        v-else-if="
          type === 'taker' &&
          options.mchStatus === 0 &&
          options.status > 0 &&
          isMch &&
          provider === 'alipay'
        "
        type="success"
        radius
        @click="takeClickByMch"
        >商家接单</DButton
      >
      <DButton
        v-else-if="
          options.status === 1 &&
          type === 'taker' &&
          provider === 'alipay' &&
          !(
            (options.orderType === 'print' || options.orderType === 'shop') &&
            options.endAddress &&
            options.endAddress.noneText === '到店自取'
          )
        "
        type="success"
        radius
        @click="takeClick"
        >帮助TA</DButton
      >

      <view v-else>
        <view v-if="options.status === 0" class="fo-24 fo-primary">待支付</view>
        <view
          v-else-if="
            options.status > 0 &&
            options.mchStatus === 0 &&
            (options.orderType === 'print' || options.orderType === 'shop')
          "
          class="fo-24 fo-info"
          >待商家接单</view
        >
        <view v-else-if="options.status === 1" class="fo-24 fo-info"
          >待接单</view
        >
        <view v-else-if="options.status === 2" class="fo-24 fo-info"
          >进行中</view
        >
        <view v-else-if="options.status === 3" class="fo-24 fo-info"
          >任务完成</view
        >
        <view v-else-if="options.status === 4" class="fo-24 fo-green"
          >已完成</view
        >
        <view v-else-if="options.status === -2" class="fo-24 fo-9">已取消</view>
        <view v-else-if="options.status === -1" class="fo-24 fo-3">已关闭</view>
      </view>
    </view>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
import { imageCenterCrop } from "@/utils/common";
import AddressText from "./AddressText.vue";
import { orderTaker, canITaker, orderTakerMch } from "@/utils/api";
export default Vue.extend({
  components: {
    AddressText,
  },
  props: {
    type: {
      type: String,
      default: "user", // taker or shop
    },
    isMch: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Object,
      default: () => {
        return {
          status: 0,
          orderNo: "",
          avatarUrl: "",
          nickName: "",
          createTimeLocal: "",
          deadlineTime: "",
          endAddress: {},
          orderType: "",
          priceDetails: {
            subTitle: "",
            desc: "",
          },
        } as any;
      },
    },
  },
  computed: {
    provider(): string {
      return this.$store.state.provider;
    },
  },
  methods: {
    imageCenterCrop,
    navTo() {
      uni.navigateTo({
        url: `/pages/order/detail?orderNo=${this.options.orderNo}${
          this.type === "taker" ? "&isTaker=1" : ""
        }`,
      });
    },
    async takeClickByMch() {
      uni.showModal({
        title: "提示",
        content: "确定要接此单？",
        success: async (res) => {
          if (res.confirm) {
            uni.showLoading({ title: "接单中" });
            const result = await orderTakerMch({
              orderNo: this.options.orderNo,
            });
            uni.hideLoading();
            if (result.code === 200) {
              uni.showToast({ title: result.msg, icon: "success" });
              this.$emit("takeSuccess");
            }
          }
        },
      });
    },

    async takeClick() {
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
            const result = await orderTaker({ orderNo: this.options.orderNo });
            uni.hideLoading();
            if (result.code === 200) {
              uni.showToast({ title: result.msg, icon: "success" });
              this.$emit("takeSuccess");
            }
          }
        },
      });
    },
  },
});
</script>
<style lang="scss" scoped>
.order-item {
  margin-bottom: 30rpx;
  background-color: #ffffff;
  padding: 30rpx;
  border-radius: 8rpx;
  box-shadow: 0 0rpx 8rpx 0rpx rgba($color: #000000, $alpha: 0.08);
  .avatar {
    width: 60rpx;
    height: 60rpx;
    border-radius: 60rpx;
    background-color: #e1e1e1;
    .avatar-image {
      width: 60rpx;
      height: 60rpx;
      border-radius: 60rpx;
    }
  }
  .address-bar {
    background-color: #ffffff;
    border-radius: 8rpx;
    border: 1rpx dashed #e1e1e1;
    padding: 20rpx;
  }
  .line-bar {
    width: 110rpx;
    height: 70rpx;
    text-align: center;
    position: relative;
    .iconfont {
      font-size: 48rpx;
      line-height: 70rpx;
    }
    .line-dot {
      height: 1px;
      width: 110rpx;
      border-top: 1px dashed #666666;
      position: absolute;
      top: 35rpx;
      left: 0;
    }
  }
  .address-content {
    width: 200rpx;
    font-size: 24rpx;
    color: #666666;
  }
  .shang {
    width: 40rpx;
    height: 40rpx;
    border-radius: 4rpx;
    font-size: 24rpx;
    text-align: center;
    line-height: 40rpx;
    color: $error;
    background-color: rgba($color: $error, $alpha: 0.12);
  }
}
</style>
