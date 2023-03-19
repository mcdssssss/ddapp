<template>
  <div class="style-btn text-center">
    <div class="style-icon">
      <i :class="['iconfont', icon]" :style="{ color }"></i>
    </div>
    <div class="fo-9 fo-12 mt-4">{{ label }}</div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    label: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: ''
    }
  }
});
</script>
<style lang="less" scoped>
.style-btn {
  margin-right: 36px;
  margin-top: 20px;
  &:last-child {
    margin-right: 0;
  }
  .style-icon {
    width: 40px;
    height: 40px;
    border-radius: 40px;
    border: 1px solid #e1e1e1;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin: auto;
    transition: background-color 0.2s linear;
    &:hover {
      background-color: #f1f1f1;
    }
    .iconfont {
      font-size: 18px;
    }
  }
}
</style>
