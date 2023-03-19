<template>
  <view class="flex flex-between item-center">
    <view
      :class="['address-tab-item', no ? 'address-tab-item--active' : '']"
      @click="$emit('change', true)"
      >校园地址</view
    >
    <view
      :class="['address-tab-item', !no ? 'address-tab-item--active' : '']"
      @click="$emit('change', false)"
      >校外地址</view
    >
  </view>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    no: {
      type: String,
      default: "",
    },
  },
});
</script>
<style lang="scss" scoped>
.address-tab-item {
  height: 70rpx;
  width: 50%;
  background-color: #f3f3f3;
  text-align: center;
  font-size: 28rpx;
  color: #666666;
  line-height: 70rpx;
  &:first-child {
    border-radius: 8rpx 0 0 0;
  }
  &:last-child {
    border-radius: 0 8rpx 0 0;
  }
}
.address-tab-item--active {
  font-weight: bold;
  color: #333333;
  background-color: #ffffff;
}
</style>
