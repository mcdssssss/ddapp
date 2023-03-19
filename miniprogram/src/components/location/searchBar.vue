<template>
  <view>
    <view class="search-bar flex flex-center item-center">
      <input
        class="search-input"
        :value="value"
        type="text"
        placeholder="输入关键字搜索"
        @change="inputChange"
        @input="input"
      />
      <DButton
        ma="ml-20"
        type="success"
        height="80rpx"
        width="120rpx"
        @click="$emit('search')"
        >搜索</DButton
      >
    </view>
    <view style="height: 120rpx"></view>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  methods: {
    inputChange(e: { detail: { value: string } }) {
      this.$emit("change", e.detail.value);
      this.$emit("search");
    },
    input(e: { detail: { value: string } }) {
      this.$emit("change", e.detail.value);
    },
  },
});
</script>
<style lang="scss" scoped>
.search-bar {
  width: 750rpx;
  height: 120rpx;
  background-color: #ffffff;
  z-index: 2;
  position: fixed;
  top: 0;
  left: 0;
  border-bottom: 1rpx solid #e1e1e1;
  .search-input {
    width: 460rpx;
    height: 80rpx;
    background-color: #f3f3f3;
    line-height: 80rpx;
    font-size: 28rpx;
    padding: 0 20rpx;
    border-radius: 8rpx;
  }
}
</style>
