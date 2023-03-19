<template>
  <div
    :class="['dbutton', 'dbutton--' + type, ma]"
    :style="{
      width,
      lineHeight: height,
      borderRadius: radius ? height : '8rpx',
    }"
    @click.stop="$emit('click', $event)"
  >
    <slot></slot>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    type: {
      type: String,
      default: "default",
    },
    width: {
      type: String,
      default: "auto",
    },
    height: {
      type: String,
      default: "60rpx",
    },
    radius: {
      type: Boolean,
      default: false,
    },
    ma: {
      type: String,
      default: "",
    },
  },
});
</script>
<style lang="scss" scoped>
.dbutton {
  padding: 0 30rpx;
  line-height: 60rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
  text-align: center;
  &:active {
    opacity: 0.8;
  }
}
.dbutton--default {
  background-color: #f3f3f3;
  color: #999999;
}
.dbutton--white {
  background-color: #ffffff;
  border: 1rpx solid #e1e1e1;
  color: #999999;
}
.dbutton--success {
  color: #ffffff;
  background-color: rgba($color: $success, $alpha: 1);
}
.dbutton--primary {
  color: #ffffff;
  background-color: rgba($color: $primary, $alpha: 1);
}
.dbutton--info {
  color: #ffffff;
  background-color: rgba($color: $info, $alpha: 1);
}
.dbutton--theme {
  color: #ffffff;
  background-color: #333333;
}
.dbutton--danger {
  color: $error;
  background-color: #ffffff;
  border: 1rpx solid $error;
}
.dbutton--coupon {
  color: #ffffff;
  background-color: #ff8088;
}
</style>
