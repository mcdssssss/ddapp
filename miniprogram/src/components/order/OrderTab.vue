<template>
  <view>
    <view class="order-tab">
      <view v-if="orderType !== 'shop'" class="flex flex-start item-center">
        <view
          v-for="(item, index) in orderTypes"
          :key="index"
          :class="[
            'ordertype-item',
            orderType === item.value ? 'ordertype-item--active' : '',
          ]"
          @click="changeOrderType(index)"
        >
          <view :class="['iconfont', item.icon, 'fo-28']"></view>
          <view class="fo-28 ml-15">{{ item.label }}</view>
        </view>
      </view>
      <view class="flex flex-start item-center">
        <view
          v-for="(item, index) in orderType === 'user'
            ? orderUserStatus
            : orderType === 'taker'
            ? orderTakerStatus
            : orderShopStatus"
          :key="index"
          :class="[
            'tab-item',
            'tab-' + orderType,
            orderStatusIndex === index ? 'tab-item--active' : '',
          ]"
          @click="
            orderStatusIndex = index;
            emitChange();
          "
          >{{ item.label }}</view
        >
      </view>
      <view
        :class="['tab-under-line']"
        :style="{
          left: `calc(${
            orderType === 'user' ? '75rpx' : '93.75rpx'
          }  - 25rpx + ${orderStatusIndex} * ${
            orderType === 'user' ? '150rpx' : '187.5rpx'
          })`,
        }"
      ></view>
    </view>
    <view
      :style="{ height: (orderType === 'shop' ? 100 : 164) + 'rpx' }"
    ></view>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    type: {
      type: String,
      default: "user",
    },
    status: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      orderType: this.type,
      orderTypes: [
        { label: "我发布的", icon: "icon-wofabude", value: "user" },
        { label: "我接收的", icon: "icon-weituo-zhuanyi-02", value: "taker" },
      ],
      orderStatusIndex: 0,
      orderUserStatus: [
        { label: "全部", value: "all" },
        { label: "待支付", value: "waitPay" },
        { label: "待接单", value: "waitTake" },
        { label: "待完成", value: "waitSuccess" },
        { label: "已完成", value: "complete" },
      ],
      orderTakerStatus: [
        { label: "全部", value: "all" },
        { label: "待我接单", value: "waitTake" },
        { label: "待完成", value: "waitSuccess" },
        { label: "已完成", value: "complete" },
      ],
      orderShopStatus: [
        { label: "全部", value: "all" },
        { label: "待接单", value: "0" },
        { label: "待完成", value: "1" },
        { label: "已完成", value: "2" },
      ],
    };
  },
  methods: {
    changeOrderType(index: number) {
      this.orderType = this.orderTypes[index].value;
      this.orderStatusIndex = 0;
      this.emitChange();
    },
    emitChange() {
      this.$emit("change", {
        orderType: this.orderType,
        status:
          this.orderType === "user"
            ? this.orderUserStatus[this.orderStatusIndex].value
            : this.orderType === "taker"
            ? this.orderTakerStatus[this.orderStatusIndex].value
            : this.orderShopStatus[this.orderStatusIndex].value,
      });
    },
  },
});
</script>
<style lang="scss" scoped>
.order-tab {
  width: 750rpx;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #ffffff;
  box-shadow: 0 0 10rpx 0 rgba($color: #000000, $alpha: 0.1);
  z-index: 1;
  .ordertype-item {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80rpx;
    width: 375rpx;
    background-color: #f3f3f3;
    color: #999;
    .iconfont {
      color: #999;
    }
  }
  .ordertype-item--active {
    background-color: #ffffff;
    color: #333;
    .iconfont {
      color: #333;
    }
  }
  .tab-user {
    width: 150rpx;
  }
  .tab-taker {
    width: 187.5rpx;
  }
  .tab-shop {
    width: 187.5rpx;
  }
  .tab-item {
    height: 80rpx;
    text-align: center;
    line-height: 80rpx;
    font-size: 24rpx;
  }
  .tab-item--active {
    color: $info;
  }
  .tab-under-line {
    width: 50rpx;
    height: 4rpx;
    background-color: $info;
    border-radius: 4rpx;
    position: relative;
    transition: 0.2s left linear;
  }
}
</style>
