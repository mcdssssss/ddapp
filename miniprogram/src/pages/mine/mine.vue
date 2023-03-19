<template>
  <view class="p-30">
    <MineAvatar />
    <view class="mine-nav-card">
      <view v-for="(item, index) in navList" :key="index">
        <MineNavItem
          :label="item.label"
          :icon="item.icon"
          :path="item.path"
          :type="item.type || 'navigate'"
        />
        <view v-if="index < navList.length - 1" class="mine-line"></view>
      </view>
    </view>
    <view class="mine-nav-card">
      <MineNavItem
        v-if="!canITaker"
        label="申请接单"
        icon="icon-wodeshenqing"
        path="/pages/mine/taker/charge?next=1"
      />
      <MineNavItem
        v-else
        label="接单员中心"
        icon="icon-wodeshenqing"
        path="/pages/mine/taker/taker"
      />
    </view>
    <view class="mine-nav-card">
      <view v-for="(item, index) in navList2" :key="index">
        <MineNavItem :label="item.label" :icon="item.icon" :path="item.path" />
        <view v-if="index < navList.length - 1" class="mine-line"></view>
      </view>
    </view>

    <button
      v-if="provider === 'weixin'"
      class="mine-nav-card filter-btn"
      open-type="contact"
    >
      <view class="p-30 flex flex-between item-center">
        <view class="flex flex-start item-center">
          <i :class="['iconfont fo-24', 'icon-kefu']"></i>
          <view class="fo-28 ml-30">联系客服</view>
        </view>
        <i class="iconfont icon-arrow-right fo-9 fo-24"></i>
      </view>
    </button>
    <Watermark />
  </view>
</template>
<script lang="ts">
import Vue from "vue";
import MineAvatar from "@/components/mine/MineAvatar.vue";
import MineNavItem from "@/components/mine/MineNavItem.vue";
import { canITaker, userInfo } from "@/utils/api";
export default Vue.extend({
  components: {
    MineAvatar,
    MineNavItem,
  },
  data() {
    return {
      canITaker: false,
      provider: uni.getStorageSync("provider"),
    };
  },
  computed: {
    userGuide(): string {
      return this.$store.state.config.userGuide;
    },

    navList(): any[] {
      const list = [] as any;
      const plugin = this.$store.state.plugin;
      list.push({
        label: "我的订单",
        icon: "icon-dingdan",
        path: "/pages/order/order",
        type: "switchTab",
      });

      list.push({
        label: "我的地址",
        icon: "icon-dizhi",
        path: "/pages/mine/address/address",
      });

      return list;
    },
    navList2(): any[] {
      return [
        {
          label: "用户指南",
          icon: "icon-zhinanzhen",
          path: `/pages/text/text${
            this.userGuide ? "?richNo=" + this.userGuide : ""
          }`,
        },
        { label: "切换账户", icon: "icon-qiehuan", path: "/pages/login/login" },
      ];
    },
  },
  async onShow() {
    uni.showLoading({ title: "加载中" });
    const result = await userInfo();
    uni.hideLoading();
    if (result.code === 200) {
      this.$store.commit("setProfile", result.data);
    }
    const takerResult = await canITaker();
    if (takerResult.code === 200 && takerResult.data) {
      uni.setStorageSync("takerNo", takerResult.data);
      this.canITaker = true;
    }

    await this.$store.dispatch("initConfigProtocol");
  },
});
</script>
<style lang="scss" scoped>
.mine-nav-card {
  box-shadow: 0 0 10rpx 0 rgba($color: #000000, $alpha: 0.1);
  border-radius: 20rpx;
  margin-top: 30rpx;
  .mine-line {
    height: 1rpx;
    width: 600rpx;
    margin-left: 90rpx;
    border-bottom: 1rpx solid #f3f3f3;
  }
}
</style>
