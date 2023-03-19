<template>
  <view class="flex flex-between item-center p-30" @click="navToCoupon">
    <view class="flex flex-start item-center">
      <view :class="['iconfont', 'icon-youhuiquan']"></view>
      <view class="fo-28 fo-3 ml-30">优惠券</view>
    </view>
    <view class="flex flex-end item-center">
      <view v-if="count === 0" class="fo-28 fo-9">暂无可用优惠券</view>
      <view v-else-if="discount === 0" class="fo-28 fo-6"
        >有 <text class="fo-price">{{ count }}</text> 张优惠券可用</view
      >
      <view v-else class="fo-28 fo-3">
        {{ label }} 优惠<text class="fo-price">{{ discount }}元</text>
      </view>
      <view class="iconfont icon-arrow-right fo-24 fo-9 ml-10"></view>
    </view>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    count: {
      type: Number,
      default: 0,
    },
    label: {
      type: String,
      default: "",
    },
    discount: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    navToCoupon() {
      uni.navigateTo({
        url: `/pages/mine/coupon/coupon?price=` + this.price,
      });
    },
  },
});
</script>
