<template>
  <navigator
    class="mine-nav-item flex flex-between item-center"
    :url="path"
    :open-type="type"
  >
    <view class="flex flex-start item-center">
      <i :class="['iconfont', icon]"></i>
      <view class="fo-28 ml-30">{{ label }}</view>
    </view>
    <i class="iconfont icon-arrow-right fo-9 fo-24"></i>
  </navigator>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    label: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
    path: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "navigate",
    },
  },
});
</script>
<style lang="scss" scoped>
.mine-nav-item {
  padding: 30rpx;
  .icon-arrow-right {
    font-size: 24rpx;
  }
}
</style>
