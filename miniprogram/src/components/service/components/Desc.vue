<template>
  <view class="errands-desc" :style="{ marginTop: mt }">
    <view class="bold fo-28 fo-3">需求描述</view>
    <view class="errands-box">
      <textarea
        :value="value"
        class="errands-content"
        :placeholder="descPlaceholder"
        :style="{
          height,
        }"
        @input="textareaInput"
      ></textarea>
      <view v-if="pic" class="p-20">
        <view class="fo-24 fo-9">
          *可上传一张图片,只有接单员可查看,长按可删除
        </view>
        <view class="errands-pic" @click="chooseImage" @longpress="delImage">
          <image
            class="errands-image"
            v-if="image"
            :src="image"
            mode="aspectFill"
          />
          <view v-if="!image" class="iconfont icon-pic"></view>
        </view>
      </view>
    </view>
    <view class="flex flex-start flex-wrap">
      <view
        v-for="(item, index) in tags"
        :key="index"
        class="errands-item"
        @click="itemClick(item)"
        >{{ item }}</view
      >
    </view>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    mt: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "",
    },
    tags: {
      type: Array,
      default: () => {
        return [] as any;
      },
    },
    height: {
      type: String,
      default: "150rpx",
    },
    pic: {
      type: Boolean,
      default: false,
    },
    descPlaceholder: {
      type: String,
      default: "描述物品特征/或在以下快捷选择您的物品",
    },
  },
  data() {
    return {
      image: "",
    };
  },
  methods: {
    textareaInput(e: { detail: { value: string } }) {
      this.$emit("change", e.detail.value);
    },
    itemClick(item: string) {
      this.$emit("change", this.value + item);
    },
    chooseImage() {
      uni.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        success: (res) => {
          this.image = res.tempFilePaths[0];
          this.$emit("image", this.image);
        },
      });
    },
    delImage() {
      if (!this.image) {
        return;
      }
      uni.showModal({
        title: "提示",
        content: "您确定要将图片删除吗?",
        success: (res) => {
          if (res.confirm) {
            this.image = "";
            this.$emit("image", "");
          }
        },
      });
    },
  },
});
</script>
<style lang="scss" scoped>
.errands-desc {
  .errands-box {
    margin-top: 20rpx;
    background-color: #f3f3f3;
    position: relative;
    .errands-pic {
      width: 100rpx;
      height: 100rpx;
      border-radius: 10rpx;
      background-color: #ffffff;
      line-height: 100rpx;
      text-align: center;
      box-shadow: 0 0 10rpx 0 rgba($color: #000000, $alpha: 0.1);
      position: absolute;
      right: 20rpx;
      bottom: -30rpx;
      background-size: cover;
      background-position: center;
      z-index: 2;
      .errands-image {
        width: 100rpx;
        height: 100rpx;
        border-radius: 10rpx;
      }
      .iconfont {
        font-size: 40rpx;
        color: #333333;
      }
    }
  }
  .errands-content {
    background-color: #f3f3f3;
    border-radius: 8rpx;
    height: 150rpx;
    font-size: 28rpx;
    padding: 20rpx;
    width: 650rpx;
  }
  .errands-item {
    padding: 0 30rpx;
    line-height: 60rpx;
    border-radius: 60rpx;
    background-color: #f3f3f3;
    font-size: 24rpx;
    color: #999999;
    margin-right: 20rpx;
    margin-top: 20rpx;
    &:hover {
      background-color: #e1e1e1;
    }
  }
}
</style>
