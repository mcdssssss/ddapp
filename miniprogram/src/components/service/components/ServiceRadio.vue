<template>
  <view :style="{ marginTop: mt }">
    <view class="flex flex-between item-center">
      <view class="bold fo-28 fo-3">{{ label }}</view>
      <view class="service-radio-group flex flex-center item-center">
        <view
          v-for="(item, index) in options"
          :key="index"
          :class="[
            'service-radio-item',
            value === item.value ? 'service-radio-item--active' : '',
          ]"
          @click="$emit('change', item.value)"
          >{{ item.label }}</view
        >
      </view>
    </view>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: {
      type: [String, Boolean, Number],
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    options: {
      type: Array,
      default: () => {
        return [] as any;
      },
    },
    mt: {
      type: String,
      default: "",
    },
  },
});
</script>
<style lang="scss" scoped>
.service-radio-group {
  box-shadow: 0 0 10rpx 0 rgba($color: #000000, $alpha: 0.1);
  height: 72rpx;
  border-radius: 8rpx;
  .service-radio-item {
    padding: 0 30rpx;
    height: 72rpx;
    line-height: 72rpx;
    color: #666666;
    font-size: 26rpx;
    background-color: #ffffff;
    border-right: 1px solid #f3f3f3;
    &:last-child {
      border-right: none;
      border-radius: 0 8rpx 8rpx 0;
    }
    &:first-child {
      border-radius: 8rpx 0 0 8rpx;
    }
  }
  .service-radio-item--active {
    background-color: $info;
    color: #ffffff;
  }
}
</style>
