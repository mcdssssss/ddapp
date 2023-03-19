<template>
  <view
    :class="['address-bar', border ? 'address-bar-border' : '']"
    :style="{ width: width ? '690rpx' : '630rpx' }"
  >
    <view
      v-if="type === 'double' || type === 'start'"
      class="address-bar-item"
      @click="nav ? navToAddress('start') : openMsg('start')"
    >
      <Dot />
      <view
        class="address-bar-content ml-30"
        :style="{ width: width ? '540rpx' : '480rpx' }"
      >
        <view
          v-if="!start.schoolNo && !start.province && !end.noneText"
          class="fo-32 fo-9"
          >{{ startPlaceholder }}</view
        >
        <view v-else>
          <view v-if="start.noneText" class="fo-32 fo-3">{{
            start.noneText
          }}</view>
          <AddressText v-else :address="start" />
        </view>
      </view>
      <i v-if="nav" class="iconfont icon-arrow-right fo-28 fo-9 ml-30"></i>
    </view>
    <view
      class="line-bar"
      v-if="type === 'double'"
      :style="{
        width: width ? '600rpx' : '540rpx',
      }"
    ></view>
    <view
      v-if="type === 'double' || type === 'end'"
      class="address-bar-item"
      @click="nav ? navToAddress('end') : openMsg('end')"
    >
      <Dot type="end" />
      <view
        class="address-bar-content ml-30"
        :style="{ width: width ? '540rpx' : '480rpx' }"
      >
        <view
          v-if="!end.schoolNo && !end.province && !end.noneText"
          class="fo-32 fo-9"
          >{{ endPlaceholder }}</view
        >
        <view v-else>
          <view v-if="end.noneText" class="fo-32 fo-3">{{ end.noneText }}</view>
          <AddressText v-else :address="end" />
        </view>
      </view>
      <i v-if="nav" class="iconfont icon-arrow-right fo-28 fo-9 ml-30"></i>
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
    nav: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      default: "double", // start or end
    },
    startPlaceholder: {
      type: String,
      default: "选择起点地址",
    },
    endPlaceholder: {
      type: String,
      default: "选择终点地址",
    },
    width: {
      type: Boolean,
      default: false,
    },
    start: {
      type: Object,
      default: () => {
        return {
          addressNo: "",
        } as any;
      },
    },
    end: {
      type: Object,
      default: () => {
        return {
          addressNo: "",
        } as any;
      },
    },
    border: {
      type: Boolean,
      default: false,
    },
    canCall: {
      type: Boolean,
      default: false,
    },
    shop: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    navToAddress(type: "start" | "end") {
      uni.navigateTo({
        url: "/pages/mine/address/address?addressType=" + type,
      });
    },
    openMsg(type: "start" | "end") {
      if (!this.canCall) {
        return false;
      }
      uni.showActionSheet({
        itemList: ["导航", "拨号联系"],
        success: (res) => {
          if (res.tapIndex === 0) {
            uni.openLocation({
              latitude: this[type].latitude,
              longitude: this[type].longitude,
            });
          } else if (res.tapIndex === 1) {
            uni.makePhoneCall({
              phoneNumber: this[type].mobileNumber,
            });
          }
        },
      });
    },
  },
});
</script>
<style lang="scss" scoped>
.address-bar-border {
  border-left: 4rpx solid $info;
}
.address-bar {
  width: 630rpx;
  margin: auto;
  border-radius: 8rpx;
  box-shadow: 0 0 10rpx 0 rgba($color: #000000, $alpha: 0.1);
  background-color: #ffffff;

  .address-bar-item {
    height: 120rpx;
    display: flex;
    padding: 0 30rpx;
    justify-content: flex-start;
    align-items: center;
    &:hover {
      background-color: #f1f1f1;
    }
    .address-bar-content {
      width: 480rpx;
    }
  }
  .line-bar {
    width: 510rpx;
    height: 1rpx;
    border-bottom: 1rpx solid #f3f3f3;
    margin-left: 90rpx;
  }
}
</style>
