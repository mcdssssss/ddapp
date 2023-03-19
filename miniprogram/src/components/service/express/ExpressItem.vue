<template>
  <view
    :class="['clear-item', active ? 'clear-item--avtive' : '']"
    @click="$emit('click')"
  >
    <view class="flex flex-between item-center">
      <view class="fo-28 fo-3">{{ options.name }}</view>
      <view class="fo-price bold ml-30"
        >{{ options.price }} <text class="bold-500 fo-24">元</text></view
      >
    </view>
    <view class="fo-9 fo-24 mt-10">{{ options.desc }}</view>
    <view v-if="active" class="active-dot"></view>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    options: {
      type: Object,
      default: () => {
        return {
          label: "",
          unitPrice: 1,
          desc: "",
        } as any;
      },
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
<style lang="scss" scoped>
.clear-item {
  padding: 20rpx;
  border-radius: 8rpx;
  box-shadow: 0 0 10rpx 0 rgba($color: #000000, $alpha: 0.1);
  background-color: #ffffff;
  margin-top: 30rpx;
  border: 2rpx solid #fff;
  position: relative;
  overflow: hidden;
}
.clear-item--avtive {
  border: 2rpx solid $info;
}
.active-dot {
  width: 30rpx;
  height: 30rpx;
  background-color: $info;
  position: absolute;
  right: -15rpx;
  bottom: -15rpx;
  transform: rotate(45deg);
}
</style>
