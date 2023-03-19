<template>
  <view :class="['flex flex-start item-center', mt > 0 ? 'mt-' + mt : '']">
    <Dot :type="type" />
    <view class="address-bar">
      <view
        class="address-bar-single ml-30 flex flex-between item-center"
        :style="{ width: transfer ? '380rpx' : '509rpx' }"
        @click="navToAddress"
      >
        <view
          class="address-bar-single-content"
          :style="{ width: transfer ? '322rpx' : '460rpx' }"
        >
          <AddressText v-if="address.addressNo" :address="address" />
          <view v-else class="text-placeholder">{{ placeholder }}</view>
        </view>
        <i class="iconfont icon-arrow-right fo-28 fo-9"></i>
      </view>

      <view
        v-if="transfer"
        :class="[
          'transfer-btn',
          address.noneText === transferText ? 'transfer-btn--active' : '',
        ]"
        @click="transferClick"
        >{{ transferText }}</view
      >
    </view>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
import Dot from "@/components/service/components/Dot.vue";
import AddressText from "@/components/service/components/AddressText.vue";
export default Vue.extend({
  components: {
    Dot,
    AddressText,
  },
  props: {
    address: {
      type: Object,
      default() {
        return {
          addressNo: "",
          noneText: "",
        };
      },
    },
    shop: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "start", // start or end
    },
    transfer: {
      type: Boolean,
      default: false,
    },
    transferText: {
      type: String,
      default: "",
    },
    mt: {
      type: Number,
      default: 0,
    },
    placeholder: {
      type: String,
      default: "",
    },
  },
  methods: {
    navToAddress() {
      if (this.address.noneText) {
        this.$emit("clearTransfer");
      }
      uni.navigateTo({
        url: "/pages/mine/address/address?addressType=" + this.type,
      });
    },
    transferClick() {
      this.$emit("transferChange", this.transferText);
    },
  },
});
</script>
<style lang="scss" scoped>
.address-bar {
  position: relative;
  height: 120rpx;
  .transfer-btn {
    position: absolute;
    bottom: 0rpx;
    left: 440rpx;
    z-index: 0;
    width: 140rpx;
    height: 60rpx;
    border-radius: 8rpx;
    background-color: #333333;
    font-size: 24rpx;
    line-height: 60rpx;
    text-align: center;
    color: #ffffff;
    &:hover {
      opacity: 0.8;
    }
  }
  .transfer-btn--active {
    width: 340rpx;
    height: 120rpx;
    line-height: 120rpx;
    border-radius: 120rpx 8rpx 8rpx 120rpx;
    z-index: 1;
    left: 240rpx;
  }
  .address-bar-single {
    background-color: #ffffff;
    padding: 20rpx;
    height: 80rpx;
    border-radius: 8rpx;
    box-shadow: 0 0rpx 8rpx 0rpx rgba($color: #000000, $alpha: 0.1);
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    &:hover {
      background: #f3f3f3;
    }
    .address-bar-single-content {
      .text-placeholder {
        font-size: 32rpx;
        color: #999999;
      }
    }
  }
}
</style>
