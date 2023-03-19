<template>
  <view :class="['service-dot--' + size, 'service-dot--' + type]"></view>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    type: {
      type: String,
      default: "start", // or end
    },
    size: {
      type: String,
      default: "default", // small
    },
  },
});
</script>
<style lang="scss" scoped>
.service-dot--default {
  width: 15rpx;
  height: 15rpx;
  border-radius: 20rpx;
  border-width: 8rpx;
  border-style: solid;
}
.service-dot--small {
  width: 10rpx;
  height: 10rpx;
  border-radius: 10rpx;
  border-width: 6rpx;
  border-style: solid;
}
.service-dot--start {
  background-color: #43cf7c;
  border-color: #c2f8d7;
}
.service-dot--end {
  background-color: #ff5733;
  border-color: #fdcec3;
}
</style>
