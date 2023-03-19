<template>
  <view class="student mt-30">
    <view class="stud-item">
      <view class="stud-image">
        <image
          v-if="image === 'exam'"
          src="@/static/card-exam.jpeg"
          mode="aspectFill"
        ></image>
        <image
          v-else-if="image === 'avatar'"
          src="@/static/avatar-card.png"
          mode="widthFix"
        ></image>
        <image
          v-else-if="image === 'national'"
          src="@/static/national-card.png"
          mode="widthFix"
        ></image>
        <image
          v-else-if="image === 'business'"
          src="@/static/bus.jpg"
          mode="widthFix"
        ></image>
      </view>
      <view class="fo-24 fo-9 mt-20 text-center">示例</view>
    </view>
    <view class="stud-item">
      <view class="stud-image" @click="chooseImage()">
        <text v-if="!value">+</text>
        <image v-else :src="value" mode="aspectFill"></image>
      </view>
      <view class="fo-24 mt-20 fo-9 text-center">上传</view>
    </view>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    value: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "exam",
    },
  },
  methods: {
    chooseImage() {
      uni.chooseImage({
        count: 1,
        success: (res) => {
          this.$emit("change", res.tempFilePaths[0]);
        },
      });
    },
  },
});
</script>
<style lang="scss" scoped>
.student {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .stud-item {
    width: 300rpx;
    .stud-image {
      width: 300rpx;
      height: 200rpx;
      border: 1rpx dashed #e1e1e1;
      border-radius: 8rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 50rpx;
      color: #aaaaaa;
      image {
        width: 300rpx;
        height: 200rpx;
        border-radius: 8rpx;
      }
    }
  }
}
</style>
