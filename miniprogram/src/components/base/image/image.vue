<template>
  <image
    :style="{
      height: height * 2 + 'rpx',
      width: width * 2 + 'rpx',
      dispay: 'block',
    }"
    :src="unoss ? src : imageCenterCrop(src, width, height, qulity)"
    :mode="mode"
  ></image>
</template>
<script lang="ts">
import Vue from "vue";
import { imageCenterCrop } from "@/utils/common";
export default Vue.extend({
  props: {
    src: {
      type: String,
      default: "",
    },
    width: {
      type: Number,
      default: 50,
    },
    height: {
      type: Number,
      default: 50,
    },
    mode: {
      type: String,
      default: "aspectFill",
    },
    qulity: {
      type: Number,
      default: 100,
    },
    unoss: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    imageCenterCrop,
  },
});
</script>
