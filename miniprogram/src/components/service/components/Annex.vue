<template>
  <view :class="[ma]">
    <view class="flex flex-between item-center">
      <view class="bold fo-28 fo-3">附件(选填) {{ images.length }}/3</view>
      <view class="fo-24 fo-9"> 附件仅接单员可查看 </view>
    </view>
    <view class="mt-30 flex flex-start item-center">
      <image
        class="image-item"
        v-for="(item, index) in images"
        :src="item"
        :key="index"
        mode="aspectFill"
        @click="openSheet(index)"
      ></image>
      <view v-if="images.length < 3" class="add-btn" @click="chooseImage()"
        >+</view
      >
    </view>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    ma: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      images: [] as string[],
    };
  },
  methods: {
    chooseImage() {
      if (this.images.length >= 3) {
        return;
      }
      uni.chooseImage({
        count: 3 - this.images.length,
        success: (res) => {
          this.images = this.images.concat(res.tempFilePaths as string[]);
          this.$emit("change", this.images);
        },
      });
    },
    openSheet(index: number) {
      uni.showActionSheet({
        itemList: ["预览", "删除"],
        success: (res) => {
          if (res.tapIndex === 0) {
            uni.previewImage({
              urls: [this.images[index]],
            });
          } else if (res.tapIndex === 1) {
            this.images.splice(index, 1);
            this.$emit("change", this.images);
          }
        },
      });
    },
  },
});
</script>
<style lang="scss" scoped>
.add-btn {
  width: 100rpx;
  height: 100rpx;
  border-radius: 8rpx;
  border: 1px solid #e1e1e1;
  line-height: 98rpx;
  text-align: center;
  color: #999;
  font-size: 40rpx;
  &:active {
    background-color: #f3f3f3;
  }
}
.image-item {
  width: 100rpx;
  height: 100rpx;
  border-radius: 8rpx;
  border: 1px solid #e1e1e1;
  margin-right: 20rpx;
}
</style>
