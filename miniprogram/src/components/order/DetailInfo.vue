<template>
  <view
    class="flex flex-between item-center fo-24 mt-30"
    @click="copy ? toCopy() : ''"
  >
    <view>{{ label }}</view>
    <view class="flex flex-end item-center">
      <view class="fo-9">{{ value }}</view>
      <view v-if="copy" class="iconfont icon-fuzhi fo-24 fo-6 ml-10"></view>
    </view>
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
    copy: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    toCopy() {
      uni.setClipboardData({
        data: this.value,
        showToast: true,
      });
    },
  },
});
</script>
