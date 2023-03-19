<template>
  <view class="taker-bar mt-30">
    <view class="flex flex-between item-center">
      <view class="fo-28">打印网点</view>
      <view class="flex flex-end item-center">
        <view v-if="takeTime" class="fo-24 fo-9 mr-15">{{
          formatDate(takeTime, "yyyy/MM/dd hh:mm")
        }}</view>
        <view v-if="status === 0" class="fo-24 fo-primary"> 待接单</view>
        <view v-else-if="status === 1" class="fo-24 fo-info"> 已接单</view>
        <view v-else class="fo-24 fo-9"> 已取消</view>
      </view>
    </view>
    <view class="flex flex-between item-center mt-20" @click="mokePhoneCall()">
      <view class="flex flex-start item-center">
        <view class="avatar">
          <image
            class="avatar-image"
            :src="imageCenterCrop(info.image, 60, 60)"
            mode="aspectFill"
          ></image>
        </view>
        <view class="fo-28 ml-30">{{ info.name }}</view>
      </view>
      <view :class="['fo-28', 'iconfont', 'icon-24gf-phoneLoudspeaker']"></view>
    </view>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
import { imageCenterCrop, formatDate } from "@/utils/common";
export default Vue.extend({
  props: {
    info: {
      type: Object,
      default: () => {
        return {
          name: "",
          image: "",
          mobileNumber: "",
        } as any;
      },
    },
    status: {
      type: Number,
      default: 0,
    },
    takeTime: {
      type: String,
      default: "",
    },
  },
  methods: {
    imageCenterCrop,
    formatDate,
    mokePhoneCall() {
      if (this.info.mobileNumber) {
        uni.makePhoneCall({
          phoneNumber: this.info.mobileNumber,
        });
      }
    },
  },
});
</script>
<style lang="scss" scoped>
.taker-bar {
  padding: 30rpx;
  border-radius: 8rpx;
  box-shadow: 0 0 10rpx 0 rgba($color: #000000, $alpha: 0.1);
  border-left: 4rpx solid $success;
  .avatar {
    width: 80rpx;
    height: 60rpx;
    border-radius: 8rpx;
    background-color: #e1e1e1;
    .avatar-image {
      width: 80rpx;
      height: 60rpx;
      border-radius: 8rpx;
    }
  }
  .icon-24gf-phoneLoudspeaker {
    color: $success;
  }
}
</style>
