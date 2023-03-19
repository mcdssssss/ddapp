<template>
  <div class="service-item flex flex-center item-center">
    <div class="icon" :style="{ backgroundColor: options.color }">
      <i :class="['iconfont', options.icon]"></i>
    </div>
    <div class="ml-12">{{ options.label }}</div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    options: {
      type: Object,
      default() {
        return {
          label: '',
          color: '',
          icon: ''
        };
      }
    }
  }
});
</script>
<style lang="less" scoped>
.service-item {
  width: 200px;
  height: 80px;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  margin-right: 20px;
  margin-bottom: 20px;
  .icon {
    width: 40px;
    height: 40px;
    border-radius: 40px;
    line-height: 40px;
    text-align: center;
    .iconfont {
      color: #ffffff;
    }
  }
}
</style>
