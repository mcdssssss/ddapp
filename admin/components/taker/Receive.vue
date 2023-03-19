<template>
  <a-modal
    title="接单员"
    :visible="visible"
    ok-text="确认"
    cancel-text="取消"
    :confirm-loading="loading"
    @ok="handleOk"
    @cancel="$emit('change', false)"
  >
    <ModalTaker v-model="takerNo" />
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
      takerNo: ''
    };
  },
  methods: {
    async handleOk() {
      this.loading = true;
      const res = await (this as any).$api.schoolOrderReceive({
        takerNo: this.takerNo,
        orderNo: this.no
      });
      this.loading = false;
      if (res.code === 200) {
        (this as any).$message.success(res.msg);
        this.$emit('change', false);
        this.$emit('success');
      }
    }
  }
});
</script>
