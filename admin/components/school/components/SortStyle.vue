<template>
  <div class="sort-style">
    <a-radio-group :value="iconInWhere" @change="inwhereChange">
      <a-radio value="underBanner"> 展示在Banner下方 </a-radio>
      <a-radio value="fixBtn"> 展示到悬浮按钮 </a-radio>
    </a-radio-group>
    <div>
      <div class="bold mt-12">
        排列方式
        <span class="fo-9 fo-12 bold-500">(选择一项排列方式，将在小程序端首页展示布局)</span>
      </div>
      <div class="flex flex-start flex-wrap">
        <div
          v-for="(item, index) in sorts"
          v-show="(iconInWhere === 'fixBtn' && index === 2) || iconInWhere === 'underBanner'"
          :key="index"
          :class="['sort-item', item.key === value ? 'sort-item--active' : '']"
          @click="$emit('change', item.key)"
        >
          <div :class="[item.key, 'sort-item-content']">
            <div v-for="(div, cur) in item.num" :key="index + '-' + cur" class="sort-div"></div>
          </div>
          <div v-if="item.key === value" class="checked-flag"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: 'sort-3'
    },
    iconInWhere: {
      type: String,
      default: 'fixBtn'
    }
  },
  data() {
    return {
      sorts: [
        { key: 'sort-2', num: 8 },
        { key: 'sort-3', num: 9 },
        { key: 'sort-4', num: 8 }
      ]
    };
  },
  methods: {
    inwhereChange(e: any) {
      this.$emit('change', 'sort-4');
      this.$emit('in-where-change', e.target.value);
    }
  }
});
</script>
<style lang="less" scoped>
.sort-style {
  padding: 16px;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  .sort-item {
    width: 100px;
    height: 100px;
    background-color: #f3f3f3;
    margin-right: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 16px;
    border: 1px solid #ffffff;
    transition: 0.2s linear border;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    &:hover {
      border: 1px solid #955ce6;
    }
    .sort-div {
      background-color: #b4b4b4;
      width: 15px;
      height: 15px;
      border-radius: 4px;
      margin-top: 2px;
    }
    .sort-item-content {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
    }
    .checked-flag {
      width: 20px;
      height: 20px;
      background-color: #955ce6;
      position: absolute;
      bottom: -10px;
      right: -10px;
      transform: rotate(45deg);
    }
    .sort-2 {
      width: 32px;
    }
    .sort-3 {
      width: 49px;
    }
    .sort-4 {
      width: 66px;
    }
  }
  .sort-item--active {
    border: 1px solid #955ce6;
  }
}
</style>
