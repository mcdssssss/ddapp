<template>
  <view class="service-tabs">
    <DScrollX height="120rpx" width="100%">
      <view
        v-for="(item, index) in options"
        :key="index"
        :class="['tab-item', index === active ? 'tab-item--active' : '']"
        @click="$emit('change', index)"
        >{{ item.showName }}
        <view v-if="index === active" class="active-line"></view>
      </view>
    </DScrollX>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    options: {
      type: Array,
      default: () => {
        return [] as any;
      },
    },
    active: {
      type: Number,
      default: 0,
    },
  },
});
</script>
<style lang="scss">
.service-tabs {
  .tab-item {
    line-height: 120rpx;
    font-size: 28rpx;
    color: #333333;
    display: inline-block;
    padding: 0 30rpx;
    position: relative;
    &:first-child {
      margin-left: 30rpx;
    }
    .active-line {
      width: 60rpx;
      height: 6rpx;
      background-color: $info;
      position: absolute;
      bottom: 0;
      left: calc(100% / 2 - 30rpx);
      border-radius: 6rpx;
    }
  }
  .tab-item--active {
    color: $info;
    // border-bottom: 4rpx solid $info;
    font-weight: bold;
  }
}
</style>
