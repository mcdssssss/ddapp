<template>
  <view class="swiper">
    <swiper
      v-if="options.length > 0"
      class="swiper"
      circular
      indicator-color="rgba(255, 87, 51, 0.3)"
      :indicator-dots="true"
      indicator-active-color="#ff5733"
      :autoplay="true"
      :interval="5000"
      :duration="500"
    >
      <swiper-item
        v-for="(item, index) in options"
        :key="index"
        @click="navTo(item.path)"
      >
        <view class="swiper-item">
          <image
            class="swiper-image"
            :src="item.image"
            mode="aspectFill"
          ></image>
        </view>
      </swiper-item>
    </swiper>
    <view v-else class="swiper-empty"></view>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    options: {
      type: Array,
      default: () => {
        return [] as { image: string; path: string }[];
      },
    },
  },
  methods: {
    navTo(path: string) {
      if (!path) {
        return;
      }
      uni.navigateTo({
        url: path,
      });
    },
  },
});
</script>
<style lang="scss" scoped>
.swiper {
  width: 690rpx;
  height: 280rpx;
  border-radius: 8rpx;
  overflow: hidden;
  position: relative;
  .swiper-item {
    width: 690rpx;
    height: 280rpx;
    background-color: #f3f3f3;
    .swiper-image {
      width: 690rpx;
      height: 280rpx;
    }
  }
  .swiper-empty {
    width: 690rpx;
    height: 280rpx;
    border-radius: 8rpx;
    background-color: #f3f3f3;
  }
}
</style>
