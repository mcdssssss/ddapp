<template>
  <view class="flex flex-end item-center">
    <view v-if="value > 0" class="input-btn" @click="reduce()">-</view>
    <input
      v-if="value > 0"
      :value="value"
      class="input-text text-center fo-28"
      type="number"
      @input="input"
    />
    <view class="input-btn" @click="add()">+</view>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    value: {
      type: Number,
      default: 1,
    },
    min: {
      type: Number,
      default: 1,
    },
    max: {
      type: Number,
      default: 10000,
    },
  },
  methods: {
    reduce() {
      if (this.value > this.min) {
        this.$emit("change", this.value - 1);
      }
    },
    add() {
      if (this.value < this.max) {
        this.$emit("change", this.value + 1);
      }
    },
    input(e: { detail: { value: string } }) {
      let value = parseInt(e.detail.value);

      if (value <= this.min || value === NaN) {
        value = this.min;
      }
      if (value >= this.max) {
        value = this.max;
      }
      this.$emit("change", value);
    },
  },
});
</script>
<style lang="scss" scoped>
.input-btn {
  width: 60rpx;
  height: 60rpx;
  border-radius: 8rpx;
  box-shadow: 0 0 8rpx 0 rgba($color: #000000, $alpha: 0.1);
  background-color: #ffffff;
  color: #666666;
  text-align: center;
  line-height: 60rpx;
  font-size: 32rpx;
  &:hover {
    background-color: #f1f1f1;
  }
}
.input-text {
  width: 100rpx;
}
</style>
