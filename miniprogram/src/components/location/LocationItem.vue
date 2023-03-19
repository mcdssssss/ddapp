<template>
  <view class="location-item flex flex-between item-end" @click="clickSchool()">
    <view class="flex flex-start item-center">
      <image
        class="location-item-image"
        :src="imageCenterCrop(options.schoolLogo, 50, 50, 100)"
        mode="aspectFill"
      ></image>
      <view class="location-content ml-20">
        <view class="fo-28 bold">{{ options.schoolName }}</view>
        <view class="flex flex-start item-center mt-10">
          <DTag type="print">{{ options.area }}</DTag>
          <DTag v-if="options.distanceText" ma="ml-20">{{
            options.distanceText
          }}</DTag>
        </view>
      </view>
    </view>
    <image
      class="location-right-icon"
      src="@/static/cri_right.png"
      mode="aspectFill"
    ></image>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
import { imageCenterCrop } from "@/utils/common";
export default Vue.extend({
  props: {
    options: {
      type: Object,
      default: () => {
        return {
          schoolNo: "",
          schoolLogo: "",
          schoolName: "",
          distanceText: "",
          area: "",
          distance: 0,
        } as any;
      },
    },
  },
  methods: {
    imageCenterCrop,
    clickSchool() {
      this.$emit("choose", this.options);
    },
  },
});
</script>
<style lang="scss" scoped>
.location-item {
  padding: 30rpx;
  border-radius: 8rpx;
  background-color: #ffffff;
  box-shadow: 0 0 10rpx 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 30rpx;
  .location-item-image {
    width: 100rpx;
    height: 100rpx;
    border-radius: 100rpx;
    background-color: #f3f3f3;
  }
  .location-right-icon {
    width: 40rpx;
    height: 40rpx;
  }
  .location-content {
    width: 450rpx;
  }
}
</style>
