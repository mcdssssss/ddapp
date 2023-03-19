<template>
  <view class="address-input-item flex flex-between item-center">
    <view class="flex flex-start item-center">
      <image
        v-if="icon === 'name'"
        class="input-icon"
        src="@/static/name.png"
        mode="aspectFill"
      ></image>
      <image
        v-else-if="icon === 'phone'"
        class="input-icon"
        src="@/static/phone.png"
        mode="aspectFill"
      ></image>
      <view v-else-if="icon === 'none'" class="input-icon"></view>
      <view v-else :class="['iconfont fo-28', icon]"></view>
      <view class="ml-30 fo-28 fo-3"
        >{{ label }} <text class="fo-24 fo-9">{{ sub ? `(${sub})` : "" }}</text>
      </view>
    </view>
    <input
      class="text-right fo-28"
      :value="value"
      :type="type"
      :style="{ width: '330rpx' }"
      :maxlength="maxlength"
      :placeholder="placeholder"
      @input="inputChange"
    />
  </view>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    label: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "name",
    },
    placeholder: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "text",
    },
    maxlength: {
      type: Number,
      default: 140,
    },
    sub: {
      type: String,
      default: "",
    },
  },
  methods: {
    inputChange({ detail }: { detail: { value: string } }) {
      this.$emit("change", detail.value);
    },
  },
});
</script>
<style lang="scss" scoped>
.address-input-item {
  padding: 30rpx;
  .input-icon {
    width: 30rpx;
    height: 30rpx;
  }
}
</style>
