<template>
  <div
    class="divider"
    :style="{ marginLeft: ml + 'px', marginRight: mr + 'px' }"
  ></div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    ml: {
      type: Number,
      default: 20,
    },
    mr: {
      type: Number,
      default: 20,
    },
  },
})
</script>
<style lang="less" scoped>
.divider {
  width: 2px;
  height: 16px;
  background-color: #d3d4d6;
}
</style>
