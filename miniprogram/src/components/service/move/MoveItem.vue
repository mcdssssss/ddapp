<template>
  <view class="move-service">
    <view class="bold fo-28 fo-3">搬家载具</view>
    <DScrollX height="370rpx" mt="30rpx">
      <view
        v-for="(item, index) in options"
        :key="index"
        :class="[
          'move-item',
          'shadow',
          active === item.id ? 'move-item--active' : '',
        ]"
        @click="$emit('change', item.id)"
      >
        <view class="move-item-image">
          <image
            :src="imageCenterCrop(item.vehiclesImage, 108, 108, 100)"
            mode="aspectFill"
          />
        </view>
        <view class="fo-3 fo-28 mt-10 text-center ell">{{
          item.vehiclesName
        }}</view>
        <view class="fo-price fo-28 bold mt-10 text-center"
          >{{ item.price }}元</view
        >
        <view v-if="active === item.id" class="active-dot"></view>
      </view>
    </DScrollX>
    <view
      v-for="(item, index) in options"
      :key="index"
      v-show="item.id === active"
      class="fo-9 fo-24 mt-10"
      >描述：{{ item.vehiclesDesc }}</view
    >
  </view>
</template>
<script lang="ts">
import Vue from "vue";
import { imageCenterCrop } from "@/utils/common";
export default Vue.extend({
  props: {
    options: {
      type: Array,
      default() {
        return [];
      },
    },
    active: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    imageCenterCrop,
  },
});
</script>
<style lang="scss" scoped>
.move-service {
  padding-top: 30rpx;
}
.move-item {
  width: 216rpx;
  padding: 20rpx;
  margin-right: 20rpx;
  display: inline-block;
  margin-top: 5rpx;
  margin-left: 5rpx;
  border-radius: 8rpx;
  border: 1rpx solid #ffffff;
  position: relative;
  overflow: hidden;
  .move-item-image {
    width: 216rpx;
    height: 216rpx;
    background-color: #f3f3f3;
    border-radius: 8rpx;
    image {
      width: 216rpx;
      height: 216rpx;
      border-radius: 8rpx;
    }
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
}
.move-item--active {
  border: 1rpx solid $info;
}
</style>
