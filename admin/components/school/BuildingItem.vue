<template>
  <div class="build-item ell">
    <div class="fo-6">
      {{ options.buildName }}
      <span class="fo-9 fo-12">{{ options.remark ? '(' + options.remark + ')' : '' }}</span>
    </div>
    <div class="build-item-opt flex flex-end item-center">
      <a class="fo-t" @click="update()"><i class="iconfont icon-edit fo-12"></i></a>
      <a class="fo-danger ml-12" @click="del()"><i class="iconfont icon-delete fo-12"></i></a>
    </div>
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
          buildName: '',
          remark: ''
        };
      }
    }
  },
  methods: {
    del() {
      (this as any).$confirm({
        title: '提示',
        content: '确定要删除吗？删除数据无法恢复恢复。',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          const result = await (this as any).$api.schoolBuildDel({ id: this.options.id });
          if (result.code === 200) {
            (this as any).$message.success('删除成功');
            this.$emit('refresh');
          }
        }
      });
    },
    update() {
      this.$emit('update', this.options);
    }
  }
});
</script>
<style lang="less" scoped>
.build-item {
  height: 40px;
  border-bottom: 1px dotted #e1e1e1;
  padding: 0 12px;
  position: relative;
  transition: 0.2s linear background-color;
  line-height: 40px;

  .build-item-opt {
    opacity: 0;
    height: 40px;
    padding: 0 12px;
    background-color: #ffffff;
    position: absolute;
    top: 0;
    right: 0;
    transition: 0.2s linear all;
  }

  &:hover {
    background-color: #f3f3f3;
    .build-item-opt {
      opacity: 1;
      background-color: #f3f3f3;
    }
  }
}
</style>
