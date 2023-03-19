<template>
  <div class="empty" :style="{ height, width }">
    <div class="text-center">
      <img :src="image" :height="imageHeight" />
      <div class="fo-6 fo-14">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
const defaultImage = require('@/assets/images/empty-design.png');
export default Vue.extend({
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    image: {
      type: String,
      default: defaultImage
    },
    imageHeight: {
      type: Number,
      default: 180
    }
  }
});
</script>
<style lang="less" scoped>
.empty {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
