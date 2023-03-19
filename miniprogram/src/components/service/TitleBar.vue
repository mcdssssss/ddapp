<template>
  <view :class="['service-title-bar', ma]">
    <view :class="['iconfont', icon, 'fo-28 fo-3']"></view>
    <view class="fo-28 fo-3 bold ml-20">{{ title }}</view>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    title: {
      type: String,
      default: "",
    },
    ma: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
  },
});
</script>
<style lang="scss" scoped>
.service-title-bar {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  image {
    width: 40rpx;
    height: 40rpx;
  }
}
</style>
