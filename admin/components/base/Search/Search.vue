<template>
  <div class="search">
    <div class="flex flex-start flex-wrap">
      <div v-for="(item, index) in options" :key="index" class="search-item">
        <a-input
          v-if="item.type === 'text'"
          v-model="formData[item.key]"
          :placeholder="item.label"
          type="text"
          @change="textChange($event, item.key)"
          @keyup.enter.native="emitChange"
        />
        <a-select
          v-else-if="item.type === 'select'"
          v-model="formData[item.key]"
          style="width: 200px"
          :placeholder="item.label"
          :options="item.options"
          @change="selectChange($event, item.key)"
        ></a-select>
      </div>
    </div>
    <div class="mt-12">
      <a-button class="search-btn" size="large" @click="reset">取消</a-button>
      <a-button
        class="search-btn"
        size="large"
        type="primary"
        :loading="loading"
        @click="emitChange"
        >搜索</a-button
      >
    </div>
    <a-divider></a-divider>
  </div>
</template>
<script lang="ts">
/**
 * key: '字段名称', type: '输入类型', label: '显示名称', like: 是否是模糊查询
 */
import Vue from 'vue';
export default Vue.extend({
  props: {
    options: {
      type: Array,
      default: () => {
        /**
         * key '字段名称'
         * type '输入类型' text or select
         * label '显示名称'
         * like 是否是模糊查询
         * options select的选项值 格式: {label:'',value:''}
         */
        return [];
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {} as any
    };
  },
  methods: {
    textChange(value: any, key: string) {
      (this.formData as any)[key] = value.target.value;
    },
    selectChange(value: any, key: string) {
      (this.formData as any)[key] = value;
    },
    emitChange() {
      const objs = Object.keys(this.formData);
      const data = {} as any;
      for (const item of objs) {
        if (this.formData[item] !== '' && this.formData[item] !== undefined) {
          data[item] = this.formData[item];
        }
      }
      this.$emit('change', data);
    },
    reset() {
      const objs = Object.keys(this.formData);
      for (const item of objs) {
        this.formData[item] = '';
      }
      this.emitChange();
    }
  }
});
</script>
<style lang="less" scoped>
.search {
  .search-item {
    width: 200px;
    margin-right: 8px;
    margin-bottom: 8px;
  }
  .search-btn {
    width: 120px;
  }
}
</style>
