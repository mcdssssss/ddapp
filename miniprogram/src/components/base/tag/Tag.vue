<template>
  <view :class="['dtag flex flex-center item-center', 'tag--' + type, ma]">
    <slot></slot>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    type: {
      type: String,
      default: "default",
    },
    ma: {
      type: String,
      default: "",
    },
  },
});
</script>
<style lang="scss" scoped>
.dtag {
  padding: 0 15rpx;
  height: 48rpx !important;
  line-height: 48rpx;
  font-size: 24rpx;
  border-radius: 4rpx;
}
.tag--default {
  background-color: #f3f3f3;
  color: #999999;
}
.tag-black {
  background-color: #666666;
  color: #ffffff;
}
.tag--print {
  color: #0099ff;
  background-color: rgba($color: #0099ff, $alpha: 0.12);
}
.tag--errands {
  color: #00cc99;
  background-color: rgba($color: #00cc99, $alpha: 0.12);
}
.tag--express {
  color: #33cc33;
  background-color: rgba($color: #33cc33, $alpha: 0.12);
}
.tag--repair {
  color: #ff9966;
  background-color: rgba($color: #ff9966, $alpha: 0.12);
}
.tag--clear {
  color: #00ccff;
  background-color: rgba($color: #00ccff, $alpha: 0.12);
}
.tag--move {
  color: #ff6600;
  background-color: rgba($color: #ff6600, $alpha: 0.12);
}
.tag--activity {
  color: #ff9900;
  background-color: rgba($color: #ff9900, $alpha: 0.12);
}
.tag--play {
  color: #9900ff;
  background-color: rgba($color: #9900ff, $alpha: 0.12);
}
.tag--software {
  color: #33cccc;
  background-color: rgba($color: #33cccc, $alpha: 0.12);
}
.tag--shop {
  color: #ff3358;
  background-color: rgba($color: #ff3358, $alpha: 0.12);
}
.tag--danger {
  color: $error;
  background-color: #ffffff;
  border: 1rpx solid $error;
}
</style>
