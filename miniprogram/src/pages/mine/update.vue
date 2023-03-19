<template>
  <view class="mine-update">
    <view class="shadow radius p-30 flex flex-between" @click="changeAvatar()">
      <view class="avatar">
        <image
          v-if="info.avatarUrl"
          :src="imageCenterCrop(info.avatarUrl, 50, 50)"
          mode="aspectFill"
        ></image>
        <view v-else class="iconfont icon-avatar"></view>
      </view>
      <view class="flex flex-end item-center">
        <view class="fo-24 fo-9">更换头像</view>
        <view class="iconfont icon-arrow-right ml-20 fo-24 fo-9"></view>
      </view>
    </view>

    <view class="shadow radius mt-30">
      <InputItem
        label="昵称"
        :value="info.nickName"
        placeholder="请输入昵称"
        :maxlength="45"
        @change="info.nickName = $event"
      />
      <view class="p-30 flex flex-between item-center">
        <view class="flex flex-start item-center">
          <view class="iconfont icon-gender fo-3"></view>
          <view class="fo-28 fo-3 ml-30">性别</view>
        </view>
        <ServiceRadius
          :value="info.gender"
          :options="[
            { label: '男神', value: 1 },
            { label: '女神', value: 2 },
          ]"
          @change="info.gender = $event"
        />
      </view>

      <view class="p-30 flex flex-center">
        <DButton
          type="theme"
          height="100rpx"
          width="500rpx"
          radius
          @click="update()"
          >保存修改</DButton
        >
      </view>
    </view>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
import { userInfo, userUpdate } from "@/utils/api";
import { imageCenterCrop, upload } from "@/utils/common";
import InputItem from "@/components/mine/InputItem.vue";
import ServiceRadius from "@/components/service/components/ServiceRadio.vue";
export default Vue.extend({
  components: {
    InputItem,
    ServiceRadius,
  },
  data() {
    return {
      info: {
        avatarUrl: "",
        nickName: "",
        gender: 0,
      },
    };
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    imageCenterCrop,
    async getInfo() {
      uni.showLoading({ title: "加载中" });
      const result = await userInfo();
      uni.hideLoading();
      if (result.code === 200) {
        this.info = result.data;
        this.$store.commit("setProfile", result.data);
      }
    },
    async update() {
      uni.showLoading({ title: "修改中" });
      const result = await userUpdate({
        nickName: this.info.nickName,
        gender: this.info.gender,
      });
      uni.hideLoading();
      if (result.code === 200) {
        uni.showToast({
          title: "修改成功",
          icon: "success",
          duration: 800,
        });
        const timeout = setTimeout(() => {
          this.getInfo();
          clearTimeout(timeout);
        }, 800);
      }
    },
    async changeAvatar() {
      uni.chooseImage({
        count: 1,
        success: async (res) => {
          uni.showLoading({ title: "上传中" });
          const image = await upload(res.tempFilePaths[0]);
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
          uni.hideLoading();
          if (result.code === 200) {
            uni.showToast({
              title: "修改成功",
              icon: "success",
              duration: 800,
            });
            const timeout = setTimeout(() => {
              this.getInfo();
              clearTimeout(timeout);
            }, 800);
          }
        },
      });
    },
  },
});
</script>
<style lang="scss" scoped>
.mine-update {
  padding: 30rpx;
  .avatar {
    width: 100rpx;
    height: 100rpx;
    border-radius: 100rpx;
    background-color: #f3f3f3;
    border: 4rpx solid #f3f3f3;
    overflow: hidden;
    image {
      width: 100rpx;
      height: 100rpx;
      border-radius: 100rpx;
    }
    .icon-avatar {
      text-align: center;
      font-size: 60rpx;
      line-height: 100rpx;
      color: #d9d9d9;
    }
  }
}
</style>
