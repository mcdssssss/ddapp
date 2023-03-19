<template>
  <view
    class="service-item"
    :style="{ width: serviceSize + 'rpx' }"
    @click="$emit('click')"
  >
    <button
      v-if="provider === 'weixin' && userNo && !avatarUrl"
      class="filter-btn"
      open-type="chooseAvatar"
      @chooseavatar="chooseAvatar"
    >
      <view
        class="service-item-icon flex flex-center item-center"
        :style="{ width: iconSize + 'rpx', height: iconSize + 'rpx' }"
      >
        <DImage
          :src="options.image"
          :width="serviceMargin"
          :height="serviceMargin"
          unoss
        ></DImage>
      </view>
    </button>

    <view
      v-else
      class="service-item-icon flex flex-center item-center"
      :style="{ width: iconSize + 'rpx', height: iconSize + 'rpx' }"
    >
      <DImage
        :src="options.image"
        :width="serviceMargin"
        :height="serviceMargin"
        unoss
      ></DImage>
    </view>
    <view class="text-center fo-24 mt-15 fo-6">{{ options.label }}</view>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
import { userUpdate, userInfo } from "@/utils/api";
import { upload } from "@/utils/common";
export default Vue.extend({
  props: {
    options: {
      type: Object,
      default: () => {
        return {
          label: "",
          image: "",
        } as any;
      },
    },
    sort: {
      type: String,
      default: "sort-4",
    },
  },
  data() {
    return {
      provider: uni.getStorageSync("provider"),
      userInfo: uni.getStorageSync("userInfo"),
    };
  },
  computed: {
    avatarUrl(): string {
      return this.$store.state.profile.avatarUrl;
    },
    userNo(): string {
      return this.$store.state.profile.userNo;
    },
    serviceSize(): number {
      if (this.sort === "sort-3") {
        return 750 / 3;
      } else if (this.sort === "sort-2") {
        return 750 / 2;
      } else {
        return 750 / 4;
      }
    },
    serviceMargin(): number {
      if (this.sort === "sort-3") {
        return 40;
      } else if (this.sort === "sort-2") {
        return 50;
      } else {
        return 30;
      }
    },
    iconSize(): number {
      if (this.sort === "sort-3") {
        return 120;
      } else if (this.sort === "sort-2") {
        return 140;
      } else {
        return 100;
      }
    },
  },
  methods: {
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
      const result = await userUpdate({ avatarUrl: e.detail.avatarUrl });
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
.service-item {
  margin-top: 30rpx;
  &:hover {
    background-color: #ffffff;
  }
  &:active {
    background-color: #ffffff;
  }
  .service-item-icon {
    background-color: #ffffff;
    // box-shadow: 0 0rpx 8rpx 0rpx rgba($color: #000000, $alpha: 0.08);
    margin: auto;
    border-radius: 100rpx;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
