<template>
  <a-dropdown>
    <a-button type="primary" size="small" ghost @click="e => e.preventDefault()">
      <i class="iconfont icon-more"></i>
    </a-button>
    <a-menu slot="overlay" @click="menuItemClick">
      <template v-for="(item, index) in options">
        <a-menu-divider v-if="item.type === 'divider'" :key="index"></a-menu-divider>
        <a-menu-item
          v-else
          :key="item.key + '-' + item.value + '-' + index"
          :disabled="item.disabled"
        >
          {{ item.label }}
        </a-menu-item>
      </template>
    </a-menu>
  </a-dropdown>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    options: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  methods: {
    menuItemClick(e: { key: string }) {
      const split = e.key.split('-');
      this.$emit('click-item', { key: split[0], value: split[1] });
    }
  }
});
</script>
