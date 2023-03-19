<template>
  <view class="clear-item flex flex-between item-center">
    <view>
      <view class="flex flex-start item-center">
        <view class="fo-28 fo-3">{{ options.name }}</view>
        <view class="fo-price bold ml-30"
          >{{ options.price }}
          <text class="bold-500 fo-24">元/{{ options.unit }}</text></view
        >
      </view>
      <view class="fo-9 fo-24 mt-10">{{ options.desc }}</view>
    </view>
    <InputNumber
      :value="options.count"
      :min="0"
      @change="$emit('countChange', $event)"
    />
  </view>
</template>
<script lang="ts">
import Vue from "vue";
import InputNumber from "@/components/service/components/InputNumber.vue";
export default Vue.extend({
  components: {
    InputNumber,
  },
  props: {
    options: {
      type: Object,
      default: () => {
        return {
          label: "",
          unitPrice: 1,
          unit: "",
          desc: "",
          count: 0,
        } as any;
      },
    },
  },
});
</script>
<style lang="scss" scoped>
.clear-item {
  padding: 20rpx;
  border-radius: 8rpx;
  box-shadow: 0 0 10rpx 0 rgba($color: #000000, $alpha: 0.1);
  background-color: #ffffff;
  margin-top: 30rpx;
}
</style>
