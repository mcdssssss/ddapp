<template>
  <picker
    :range="arr"
    :value="active"
    range-key="weightText"
    @change="pickerChange"
  >
    <view class="weight-picker">
      <view class="bold fo-28 fo-3">物品重量</view>
      <view class="flex flex-end item-center">
        <view class="fo-28 fo-6 mr-20">{{ arr[active].weightText }}</view>
        <i class="iconfont icon-arrow-right fo-9 fo-24"></i>
      </view>
    </view>
  </picker>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    options: {
      type: Array,
      default: () => {
        return [] as Array<any>;
      },
    },
    active: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    arr(): any[] {
      const arr = this.options as any;
      for (const item of arr) {
        if (item.gt === 0) {
          item.weightText = `小于${item.lte}kg`;
        } else {
          item.weightText = `${item.gt}~${item.lte}kg`;
        }
      }
      return arr;
    },
  },
  methods: {
    pickerChange(e: { detail: { value: string } }) {
      this.$emit("change", e.detail.value);
    },
  },
});
</script>
<style lang="scss" scoped>
.weight-picker {
  height: 120rpx;
  margin-top: -30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
