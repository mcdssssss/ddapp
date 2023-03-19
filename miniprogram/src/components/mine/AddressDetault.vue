<template>
  <view class="flex flex-between item-center p-30">
    <view class="flex flex-start item-center">
      <image
        style="width: 30rpx; height: 30rpx"
        src="@/static/default.png"
        mode="aspectFill"
      ></image>
      <view class="ml-30 ell fo-28">默认地址</view>
    </view>
    <switch :checked="value" @change="$emit('change', $event.detail.value)" />
  </view>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
