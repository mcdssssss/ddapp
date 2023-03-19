<template>
  <view class="mine-avatar flex flex-start item-center">
    <button
      class="filter-btn mine-avatar-image"
      open-type="chooseAvatar"
      @chooseavatar="chooseAvatar"
    >
      <image
        :src="imageCenterCrop(avatarUrl, 70, 70, 100)"
        mode="aspectFill"
      ></image>
    </button>
    <view class="mine-avatar-content">
      <view class="fo-28 bold fo-3">{{ nickName || "未登录用户" }}</view>
      <view class="fo-28 fo-6 mt-15">{{ mobileNumber || "--- --- ---" }}</view>
      <view class="fo-24 fo-9 mt-5">ID：{{ userNo || "----" }}</view>
    </view>
    <view class="mine-edit" @click="navToUpdate()">
      <i class="iconfont icon-yonghuziliaoxiugai"></i>
    </view>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
import { userUpdate, userInfo } from "@/utils/api";
import { upload } from "@/utils/common";
import { imageCenterCrop } from "@/utils/common";
export default Vue.extend({
  computed: {
    avatarUrl(): string {
      return this.$store.state.profile.avatarUrl;
    },
    nickName(): string {
      return this.$store.state.profile.nickName;
    },
    mobileNumber(): string {
      return this.$store.state.profile.mobileNumber;
    },
    userNo(): string {
      return this.$store.state.profile.userNo;
    },
  },
  methods: {
    imageCenterCrop,
    navToUpdate() {
      uni.navigateTo({
        url: "/pages/mine/update",
      });
    },
    async chooseAvatar(e: { detail: { avatarUrl: string } }) {
      uni.showLoading({ title: "上传中" });
      const image = await upload(e.detail.avatarUrl);
      uni.hideLoading();
      if (!image) {
        uni.showToast({
          title: "上传失败",
          icon: "none",
        });
        return;
      }
      uni.showLoading({ title: "修改中" });
      const result = await userUpdate({ avatarUrl: image as string });
      if (result.code === 200) {
        const result = await userInfo();
        if (result.code === 200) {
          this.$store.commit("setProfile", result.data);
        }
      }
      uni.hideLoading();
    },
  },
});
</script>
<style lang="scss" scoped>
.mine-avatar {
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 0 10rpx 0 rgba($color: #000000, $alpha: 0.1);
  background-color: #ffffff;
  position: relative;

  .mine-avatar-image {
    width: 140rpx;
    height: 140rpx;
    border-radius: 20rpx;
    background-color: #e1e1e1;
    image {
      width: 140rpx;
      height: 140rpx;
      border-radius: 20rpx;
    }
  }

  .mine-avatar-content {
    width: 460rpx;
    margin-left: 30rpx;
  }

  .mine-edit {
    width: 60rpx;
    height: 60rpx;
    box-shadow: 0 0 10rpx 0 rgba($color: #000000, $alpha: 0.1);
    position: absolute;
    right: 30rpx;
    top: 30rpx;
    line-height: 60rpx;
    border-radius: 60rpx;
    text-align: center;
    .iconfont {
      font-size: 26rpx;
    }
  }
}
</style>
