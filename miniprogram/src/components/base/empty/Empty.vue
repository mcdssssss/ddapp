<template>
  <view class="empty flex flex-center">
    <view>
      <image
        v-if="type === 'empty'"
        class="empty-image"
        src="@/static/empty.png"
        mode="widthFix"
      ></image>
      <image
        v-else-if="type === 'shop'"
        class="empty-image"
        src="@/static/shop-none.png"
        mode="widthFix"
      ></image>
      <image
        v-else-if="type === 'order'"
        class="empty-image"
        src="@/static/order-none.png"
        mode="widthFix"
      ></image>
      <image
        v-else-if="type === 'coupon'"
        class="empty-image"
        src="@/static/coupon-none.png"
        mode="widthFix"
      ></image>
      <image
        v-else-if="type === 'search'"
        class="empty-image"
        src="@/static/search-none.png"
        mode="widthFix"
      ></image>
      <view class="fo-26 fo-9 text-center mt-20"><slot></slot></view>
    </view>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    type: {
      type: String,
      default: "empty",
    },
  },
});
</script>
<style lang="scss" scoped>
.empty {
  padding: 30rpx 0;
  .empty-image {
    width: 200rpx;
    margin: auto;
    display: block;
  }
}
</style>
