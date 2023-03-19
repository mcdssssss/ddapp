<template>
  <a-modal
    title="拒绝理由"
    :visible="visible"
    ok-text="确认"
    cancel-text="取消"
    :confirm-loading="loading"
    :destroy-on-close="true"
    @ok="handleOk"
    @cancel="$emit('change', false)"
  >
    <a-input v-model="refuseReason" placeholder="请输入拒绝的理由" />
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
    no: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      refuseReason: ''
    };
  },
  methods: {
    async handleOk() {
      this.loading = true;
      const res = await (this as any).$api.riderRefuse({
        userNo: this.no,
        refuseReason: this.refuseReason
      });
      this.loading = false;
      if (res.code === 200) {
        (this as any).$message.success('操作成功');
        this.$emit('change', false);
        this.$emit('success');
      }
    }
  }
});
</script>
