<template>
  <view class="taker-bar mt-30">
    <view class="flex flex-between item-center">
      <view class="fo-28">接单员</view>
      <view class="fo-24 fo-9"
        ><text>{{ status === 4 ? "获得" : "可得" }}</text>
        <text class="fo-price ml-5">{{ price }}元</text>
        <text class="fo-22 fo-9">(含手续费)</text>
      </view>
    </view>
    <view class="flex flex-between item-center mt-20" @click="mokePhoneCall()">
      <view class="flex flex-start item-center">
        <view class="avatar">
          <image
            class="avatar-image"
            :src="imageCenterCrop(info.avatarUrl, 60, 60)"
            mode="aspectFill"
          ></image>
        </view>
        <view class="fo-28 ml-30">{{
          info.mobileNumber ? info.realName : info.nickName
        }}</view>
      </view>
      <view
        :class="[
          'fo-28',
          'iconfont',
          info.mobileNumber
            ? 'icon-24gf-phoneLoudspeaker'
            : 'icon-24gf-phoneLock',
        ]"
      ></view>
    </view>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
import { imageCenterCrop } from "@/utils/common";
export default Vue.extend({
  props: {
    info: {
      type: Object,
      default: () => {
        return {
          nickName: "",
          realName: "",
          mobileNumber: "",
          avatarUrl: "",
        } as any;
      },
    },
    status: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    imageCenterCrop,
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
  border-left: 4rpx solid $primary;
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
  .icon-24gf-phoneLoudspeaker {
    color: $success;
  }
  .icon-24gf-phoneLock {
    color: #aaaaaa;
  }
}
</style>
