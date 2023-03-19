<template>
  <view class="p-30 charge">
    <view class="fo-50 text-center mt-30">手续费说明</view>

    <view class="fo-24 fo-9 mt-30">
      以下为
      本校各项服务的手续费用。为保证平台平稳可持续发展，征收手续费用于平台的日常维护。
    </view>
    <view class="mt-30 shadow radius">
      <view class="service-item">
        <view class="service-item-col bold">服务项</view>
        <view class="service-item-col bold">手续费</view>
      </view>
      <view v-for="(item, index) in services" :key="index" class="service-item">
        <view class="service-item-col fo-6">{{ item.label }}</view>
        <view class="service-item-col fo-6"
          >{{ Math.floor(item.extractForPlatform * 10000) / 100 }}%</view
        >
      </view>
    </view>
    <view class="fo-24 fo-9 mt-30">
      <!-- 注意：打印服务中含有跑腿部分服务，跑腿部分服务按跑腿手机费计算。 -->
    </view>
    <view v-if="hasNext" class="mt-30">
      <DButton type="theme" height="100rpx" @click="next()">下一步</DButton>
    </view>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
import { ServiceData } from "@/store/modules/school";
import { takerInfo } from "@/utils/api";
export default Vue.extend({
  components: {},
  data() {
    return {
      // 是否有下一步
      hasNext: false,
    };
  },
  computed: {
    services(): ServiceData[] {
      return this.$store.state.school.services;
    },
  },
  onLoad(options: { next: string }) {
    if (options.next) {
      this.hasNext = true;
      this.takerInfo();
    }
  },
  methods: {
    async takerInfo() {
      const result = await takerInfo();
      uni.hideLoading();
      if (result.code === 200 && result.data) {
        uni.redirectTo({
          url: "/pages/mine/taker/status",
        });
      }
    },
    next() {
      uni.redirectTo({
        url: "/pages/mine/taker/register",
      });
    },
  },
});
</script>
<style lang="scss" scoped>
.charge {
  .service-item {
    padding: 30rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .service-item-col {
      width: 50%;
      font-size: 24rpx;
      text-align: center;
    }
  }
}
</style>
