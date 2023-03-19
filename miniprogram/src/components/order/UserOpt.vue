<template>
  <view v-if="status !== 4 && status !== -1 && status !== -2">
    <view class="order-bottom-bar flex flex-between item-center">
      <view class="flex flex-start item-center">
        <DButton
          class="ml-20"
          v-if="status === 0 || status === 1 || status === 2 || status === 3"
          radius
          @click="clickCancel()"
          >取消订单</DButton
        >
      </view>
      <view class="flex flex-end item-center">
        <DButton
          ma="mr-20"
          v-if="status === 0"
          type="info"
          radius
          @click="payAgain()"
          >立即支付</DButton
        >
        <DButton
          ma="mr-20"
          v-if="status === 3"
          type="info"
          radius
          @click="clickComplete()"
          >确认完成</DButton
        >
      </view>
    </view>
    <view style="height: 120rpx"></view>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
import { orderCancel, orderComplete } from "@/utils/api";
import { pay } from "@/utils/pay";
import { payAgain } from "@/utils/api";
import { requestSubscribe } from "@/utils/common";
export default Vue.extend({
  props: {
    status: {
      type: Number,
      default: 0,
    },
    no: {
      type: String,
      default: "",
    },
    mchStatus: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    async payAgain() {
      // 配置订阅消息
      const storeTempIds = this.$store.state.config.tempIds;
      const tempids = [] as string[];
      if (storeTempIds.orderReceive) {
        tempids.push(storeTempIds.orderReceive);
      }
      if (storeTempIds.orderComplete) {
        tempids.push(storeTempIds.orderComplete);
      }
      if (storeTempIds.orderCancel) {
        tempids.push(storeTempIds.orderCancel);
      }
      await requestSubscribe(tempids);

      uni.showLoading({
        title: "发起支付中",
      });

      const result = await payAgain({ orderNo: this.no });
      uni.hideLoading();
      if (result.code === 200) {
        pay(result.data);
      }
    },
    clickCancel() {
      uni.showModal({
        title: "提示",
        content: "确定要继续取消订单吗？",
        success: async (res) => {
          if (res.confirm) {
            if (
              this.status === 1 ||
              this.status === 0 ||
              this.status === 2 ||
              this.status === 3
            ) {
              uni.showLoading({ title: "取消中" });
              const result = await orderCancel({ orderNo: this.no });
              uni.hideLoading();
              if (result.code === 200) {
                this.$emit("refresh");
              }
            }
          }
        },
      });
    },
    clickComplete() {
      uni.showModal({
        title: "提示",
        content: "请确保任务已完成，是否确认完成？",
        success: async (res) => {
          if (res.confirm) {
            uni.showLoading({ title: "请稍等" });
            const result = await orderComplete({ orderNo: this.no });
            uni.hideLoading();
            if (result.code === 200) {
              this.$emit("refresh");
            }
          }
        },
      });
    },
  },
});
</script>
<style lang="scss" scoped>
.order-bottom-bar {
  height: 120rpx;
  width: 750rpx;
  background-color: #ffffff;
  position: fixed;
  bottom: 0;
  left: 0;
  box-shadow: 0 0 10rpx 0 rgba(0, 0, 0, 0.1);
}
</style>
