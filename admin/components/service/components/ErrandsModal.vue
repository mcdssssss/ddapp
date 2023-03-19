<template>
  <a-modal
    :visible="visible"
    title="添加跑腿项"
    :destroy-on-close="true"
    ok-text="确定"
    cancel-text="取消"
    @ok="handleOk"
    @cancel="$emit('change', false)"
  >
    <div class="fo-14">选择跑腿项: <a @click="getList()">刷新数据</a></div>
    <a-select v-model="current" class="mt-12" style="width: 100%" placeholder="选择跑腿项">
      <a-select-option v-for="(item, index) in list" :key="index" :value="index"
        >{{ item.templateName }}({{ item.showName }})</a-select-option
      >
    </a-select>
    <div class="fo-12 mt-12">
      <router-link :to="{ path: '/service/errands/edit/add' }" target="_blank"
        >没有找到跑腿项点此添加</router-link
      >
    </div>
  </a-modal>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  model: {
    prop: 'visible',
    event: 'change'
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      current: -1,
      list: []
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    handleOk() {
      this.$emit('choose', this.list[this.current]);
    },
    async getList() {
      const res = await (this as any).$api.errandsList({ current: 1, pageSize: 1000 });
      if (res.code === 200) {
        this.list = res.data.data;
        if (this.list.length > 0) {
          this.current = 0;
        }
      }
    }
  }
});
</script>
<style lang="less" scoped></style>
