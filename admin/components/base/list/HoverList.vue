<template>
  <div
    class="hover-list"
    :style="{ width: width + 'px' }"
    @click="$emit('click', $event)"
  >
    {{ label }}
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    width: {
      type: Number,
      default: 100,
    },
    label: {
      type: String,
      default: '',
    },
  },
})
</script>
<style lang="less" scoped>
.hover-list {
  padding: 12px;
  color: #666666;
  cursor: pointer;
  &:first-child {
    border-radius: 4px 4px 0 0;
  }
  &:last-child {
    border-radius: 0 0 4px 4px;
  }
  &:hover {
    background-color: #965ce611;
    color: #965ce6;
  }
}
</style>
