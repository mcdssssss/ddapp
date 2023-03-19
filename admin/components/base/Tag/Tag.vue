<template>
  <div class="c-tag" :style="{ color, backgroundColor: color + '1a' }">
    <slot></slot>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    color: {
      type: String,
      default: ''
    }
  }
});
</script>
<style lang="less" scoped>
.c-tag {
  font-size: 12px;
  line-height: 20px;
  padding: 0 4px;
  border-radius: 2px;
}
</style>
