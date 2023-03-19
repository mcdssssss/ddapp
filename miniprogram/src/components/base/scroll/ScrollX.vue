<template>
  <scroll-view
    class="scroll-x"
    scroll-x="true"
    :style="{ height, width, marginTop: mt }"
    ><slot></slot
  ></scroll-view>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    height: {
      type: String,
      default: "",
    },
    width: {
      type: String,
      default: "",
    },
    mt: {
      type: String,
      default: "",
    },
  },
});
</script>
<style lang="scss" scoped>
.scroll-x {
  white-space: nowrap;
  display: flex;
}
</style>
