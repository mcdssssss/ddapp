<template>
  <view>
    <view
      :class="['service-tab mt-30', fixed ? 'shadow' : '']"
      :style="{ position: fixed ? 'fixed' : '' }"
    >
      <DScrollX height="100rpx" width="750rpx">
        <view
          :class="[
            'service-tab-item',
            active === '' ? 'service-tab-item--active' : '',
          ]"
          @click="$emit('change', '')"
          >全部
          <view v-if="active === ''" class="active-line"></view>
        </view>
        <view
          v-for="(item, index) in services"
          :key="index"
          :class="[
            'service-tab-item',
            active === item.type ? 'service-tab-item--active' : '',
          ]"
          :style="{ display: !item.intoHall ? 'none' : 'inline-block' }"
          @click="$emit('change', item.type)"
          >{{ item.label }}
          <view v-if="active === item.type" class="active-line"></view>
        </view>
      </DScrollX>
    </view>
    <view v-if="fixed" style="height: 100rpx"></view>
  </view>
</template>
<script lang="ts">
import { ServiceData } from "@/store/modules/school";
import Vue from "vue";
export default Vue.extend({
  props: {
    active: {
      type: String,
      default: "",
    },
    fixed: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  computed: {
    services(): ServiceData[] {
      return this.$store.state.school.services;
    },
  },
  methods: {
    changeTab() {},
  },
});
</script>
<style lang="scss" scoped>
.service-tab {
  height: 100rpx;
  top: 60rpx;
  left: 0;
  background-color: #ffffff;
  .service-tab-item {
    line-height: 60rpx;
    font-size: 28rpx;
    border-radius: 60rpx;
    color: #333333;
    display: inline-block;
    margin-left: 60rpx;
    margin-top: 20rpx;
    transition: all 0.2s linear;
    position: relative;
    &:last-child {
      margin-right: 60rpx;
    }
    .active-line {
      height: 6rpx;
      width: 50rpx;
      border-radius: 4rpx;
      background-color: $info;
      margin: auto;
      margin-top: 14rpx;
    }
  }
  .service-tab-item--active {
    // background-color: $info;
    color: $info;
    font-weight: bold;
  }
}
</style>
