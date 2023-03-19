<template>
  <a-popover :placement="placement" trigger="click">
    <template slot="content">
      <ColorPicker :value="color" @input="colorInput" />
    </template>
    <div class="color-picker-btn" :style="{ backgroundColor: color }"></div>
  </a-popover>
</template>
<script lang="ts">
import Vue from 'vue';
import { Chrome } from 'vue-color';
export default Vue.extend({
  components: {
    ColorPicker: Chrome
  },
  model: {
    prop: 'color',
    event: 'change'
  },
  props: {
    color: {
      type: String,
      default: '#ffffff'
    },
    placement: {
      type: String,
      default: 'top'
    }
  },
  methods: {
    colorInput(e: any) {
      this.$emit('change', e.hex);
    }
  }
});
</script>
<style lang="less" scoped>
.color-picker-btn {
  width: 120px;
  height: 40px;
  border-radius: 4px;
  border: 1px solid #e1e1e1;
  transition: 0.2s linear border;
  cursor: pointer;
  &:hover {
    border: 1px solid #955ce6;
  }
}
</style>
