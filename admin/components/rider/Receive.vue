<template>
  <a-modal
    title="配送员"
    :visible="visible"
    ok-text="确认"
    cancel-text="取消"
    :confirm-loading="loading"
    @ok="handleOk"
    @cancel="$emit('change', false)"
  >
    <ModalRider v-model="riderNo" />
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
    },
    type: {
      type: String,
      default: 'receive' // or send
    }
  },
  data() {
    return {
      loading: false,
      riderNo: ''
    };
  },
  methods: {
    async handleOk() {
      this.loading = true;
      const res = await (this as any).$api[
        this.type === 'receive' ? 'orderReceive' : 'orderDeliver'
      ]({
        riderNo: this.riderNo,
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
