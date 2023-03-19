<template>
  <a-modal
    :visible="visible"
    :title="type === 'add' ? '添加区域' : '修改区域'"
    :destroy-on-close="true"
    :confirm-loading="confirmLoading"
    ok-text="确定"
    cancel-text="取消"
    @ok="handleOk"
    @cancel="$emit('change', false)"
  >
    <div class="fo-14">区域名称:</div>
    <a-input v-model="formData.areaName" class="mt-12" placeholder="请输入区域名称"></a-input>

    <div class="fo-14 mt-20">是否显示:</div>
    <a-radio-group v-model="formData.status" class="mt-12">
      <a-radio :value="1"> 显示 </a-radio>
      <a-radio :value="0"> 关闭 </a-radio>
    </a-radio-group>
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
        areaName: '',
        status: 0,
        schoolNo: this.$route.query.schoolNo
      },
      confirmLoading: false
    };
  },
  methods: {
    async handleOk() {
      if (!this.formData.areaName) {
        (this as any).$message.error('请输入区域名称');
        return;
      }
      this.confirmLoading = true;
      const res = await (this as any).$api[
        this.type === 'add' ? 'schoolAreaAdd' : 'schoolAreaUpdate'
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
