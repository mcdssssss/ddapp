<template>
  <view class="flex flex-between item-center p-30">
    <view class="flex flex-start item-center">
      <view :class="['iconfont', icon]"></view>
      <view class="fo-28 fo-3 ml-30">{{ label }}</view>
    </view>
    <input
      :value="value"
      class="text-right fo-28"
      :type="type"
      :placeholder="placeholder"
      @input="$emit('change', $event.detail.value)"
    />
  </view>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    value: {
      type: [String, Number],
      default: "",
    },
    type: {
      type: String,
      default: "text",
    },
    placeholder: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
  },
});
</script>