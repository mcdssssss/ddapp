<template>
  <view class="border-b" @click="show = !show">
    <view class="info-item">
      <view class="fo-24">{{ label }}</view>
      <view class="flex flex-end item-center">
        <view class="fo-24">{{ value }}</view>
        <view
          v-if="details.length > 0"
          :class="[
            'ml-20',
            'iconfont',
            'fo-24 fo-9 scale-8',
            show ? 'icon-arrow-top' : 'icon-arrow-bottom',
          ]"
        ></view>
      </view>
    </view>
    <view v-if="details.length > 0 && show" class="pb-30">
      <view v-for="(item, index) in details" :key="index" class="fo-9 fo-24">{{
        item
      }}</view>
    </view>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    details: {
      type: Array,
      default: [] as string[],
    },
    label: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      show: false,
    };
  },
});
</script>
<style lang="scss" scoped>
.info-item {
  display: flex;
  justify-content: space-between;
  padding: 30rpx 0;
}
</style>