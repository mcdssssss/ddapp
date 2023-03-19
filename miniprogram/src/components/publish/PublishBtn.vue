<template>
  <view>
    <view class="publish-btn flex flex-between item-center">
      <view class="ml-20 flex flex-start item-center">
        <view class="fo-24">需支付</view>
        <view class="fo-28 bold ml-15">{{ price }}元</view>
      </view>
      <DButton ma="mr-20" type="theme" height="90rpx" @click="$emit('publish')"
        >付款并发布</DButton
      >
    </view>
    <view style="height: 150rpx"></view>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    price: {
      type: Number,
      default: 0.0,
    },
  },
});
</script>
<style lang="scss" scoped>
.publish-btn {
  width: 690rpx;
  position: fixed;
  bottom: 30rpx;
  left: 30rpx;
  height: 120rpx;
  background-color: #ffffff;
  box-shadow: 0 0 10rpx 0 rgba($color: #000000, $alpha: 0.1);
  border-radius: 8rpx;
  z-index: 2;
}
</style>
