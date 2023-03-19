<template>
  <picker :range="arr" :value="active" range-key="label" @change="pickerChange">
    <view class="weight-picker">
      <view class="flex flex-start item-center">
        <view class="iconfont icon-naozhong"></view>
        <view class="fo-28 fo-3 ml-30">时间要求</view>
      </view>
      <view class="flex flex-end item-center">
        <view class="fo-28 fo-6 mr-20">{{ arr[active].label }}</view>
        <i class="iconfont icon-arrow-right fo-9 fo-24"></i>
      </view>
    </view>
  </picker>
</template>
<script lang="ts">
import Vue from "vue";
import { getRequirement } from "@/utils/api";
export default Vue.extend({
  props: {
    active: {
      type: Number,
      default: 0,
    },
    value: {
      type: Number,
      default: 0.5,
    },
  },
  data() {
    return {
      arr: [
        { label: "立刻需要", value: 0.5 },
        { label: "2小时内", value: 2 },
        { label: "4小时内", value: 4 },
        { label: "6小时内", value: 6 },
        { label: "24小时内", value: 24 },
        { label: "48小时内", value: 48 },
      ],
    };
  },
  async mounted() {
    const { data } = await getRequirement();
    const timeArr = data?.timeRequirements || [];
    interface Item {
      timeLabel: string;
      timeValue: number;
      value: number;
      label: string;
    }
    timeArr.map((item: Item) => {
      item.value = item.timeValue;
      item.label = item.timeLabel;
    });
    if (timeArr.length > 0) {
      this.arr = timeArr;
    }
  },
  methods: {
    pickerChange(e: { detail: { value: string } }) {
      this.$emit("change", {
        active: e.detail.value,
        value: this.arr[parseInt(e.detail.value)].value,
      });
    },
  },
});
</script>
<style lang="scss" scoped>
.weight-picker {
  padding: 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
