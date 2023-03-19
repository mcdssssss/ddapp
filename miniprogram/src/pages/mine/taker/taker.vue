<template>
  <view class="p-30">
    <view class="card-panel shadow">
      <view class="flex flex-between item-center ml-30">
        <view class="fo-w fo-24"
          >余额: <text class="fo-50 ml-10 bold">{{ info.balance }}</text>
          <text class="fo-24 ml-5">元</text></view
        >
      </view>
      <view class="flex flex-between item-center mt-30">
        <view class="dot-item">
          <view class="text-center fo-28 fo-w"
            >{{ info.todayTotal }} <text class="fo-24">单</text></view
          >
          <view class="text-center fo-24 fo-w">今日成单</view>
        </view>
        <view class="dot-item">
          <view class="text-center fo-28 fo-w"
            >{{ info.monthTotal }} <text class="fo-24">单</text></view
          >
          <view class="text-center fo-24 fo-w">本月成单</view>
        </view>
        <view class="dot-item">
          <view class="text-center fo-28 fo-w"
            >{{ info.allTotal }} <text class="fo-24">单</text></view
          >
          <view class="text-center fo-24 fo-w">累计成单</view>
        </view>
      </view>
    </view>

    <view class="shadow radius mt-30">
      <MineNavItem
        label="提现"
        icon="icon-cash"
        path="/pages/mine/taker/cash/cash"
      />
      <view class="mine-line"></view>
      <MineNavItem
        label="手续费"
        icon="icon-protocol"
        path="/pages/mine/taker/charge"
      />
    </view>

    <view class="shadow radius mt-30">
      <MineNavItem label="接单员指南" icon="icon-zhinanzhen" :path="takepath" />
      <view class="mine-line"></view>
      <MineNavItem
        label="接单员状态"
        icon="icon-status"
        path="/pages/mine/taker/status"
      />
    </view>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
import MineNavItem from "@/components/mine/MineNavItem.vue";
import { takerAnlysis } from "@/utils/api";
export default Vue.extend({
  components: {
    MineNavItem,
  },
  data() {
    return {
      info: {
        accumulatedCash: 0,
        accumulatedIncome: 0,
        allTotal: 0,
        balance: 0,
        monthTotal: 0,
        todayTotal: 0,
      },
    };
  },
  computed: {
    takerGuide(): string {
      return this.$store.state.config.takerGuide;
    },
    takepath(): string {
      return `/pages/text/text?richNo=${this.takerGuide}`;
    },
  },
  async onLoad() {
    await this.$store.dispatch("initConfigProtocol");
    this.takerAnlysis();
  },
  methods: {
    async takerAnlysis() {
      uni.showLoading({
        title: "加载中",
      });
      const result = await takerAnlysis();
      uni.hideLoading();
      if (result.code === 200) {
        this.info = result.data;
      }
    },
  },
});
</script>
<style lang="scss" scoped>
.card-panel {
  border-radius: 12rpx;
  padding: 30rpx;
  background-image: linear-gradient(to right, #43cf7c 0%, #43e97b 100%);
}
.dot-item {
  width: 33.33%;
}
.mine-line {
  height: 1rpx;
  width: 600rpx;
  margin-left: 90rpx;
  border-bottom: 1rpx solid #f3f3f3;
}
</style>
