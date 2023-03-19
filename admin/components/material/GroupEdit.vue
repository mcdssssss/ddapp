<template>
  <a-modal
    :visible="visible"
    :title="type === 'add' ? '添加分组' : '修改分组'"
    :destroy-on-close="true"
    :confirm-loading="confirmLoading"
    ok-text="确定"
    cancel-text="取消"
    :width="300"
    @ok="handleOk"
    @cancel="$emit('change', false)"
  >
    <div class="fo-14">分组名称:</div>
    <a-input v-model="formData.groupName" class="mt-12" placeholder="请输入分组名称"></a-input>
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
    },
    type: {
      type: String,
      default: 'add'
    }
  },
  data() {
    return {
      formData: {
        groupName: ''
      },
      confirmLoading: false
    };
  },
  methods: {
    async handleOk() {
      if (!this.formData.groupName) {
        (this as any).$message.error('请输入分组名称');
        return;
      }
      this.confirmLoading = true;
      const res = await (this as any).$api[
        this.type === 'add' ? 'fileGroupAdd' : 'fileGroupUpdate'
      ](this.formData);
      this.confirmLoading = false;
      if (res.code === 200) {
        this.$emit('success');
      }
    }
  }
});
</script>
<style lang="less" scoped></style>
