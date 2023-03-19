<template>
  <a-modal
    :visible="visible"
    title="订单一键处理"
    ok-text="确定"
    cancel-text="取消"
    :confirm-loading="loading"
    @ok="handleOk"
    @cancel="$emit('change', false)"
  >
    <div>
      <a-checkbox v-model="formData.waitPayAutoCanel"> 取消超过15分钟未付款订单 </a-checkbox>
    </div>
    <div class="mt-20">
      <a-checkbox v-model="formData.deadlineAutoCancel"> 取消超过截止时间未接单订单 </a-checkbox>
    </div>
    <div class="mt-20">
      <a-checkbox v-model="formData.autoCompete"> 超过2小时未点击确认的订单自动完成 </a-checkbox>
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
      formData: {
        waitPayAutoCanel: true,
        autoCompete: true,
        deadlineAutoCancel: true
      },
      loading: false
    };
  },

  methods: {
    async handleOk() {
      this.loading = true;
      const res = await (this as any).$api.schoolorderOneClickHandle(this.formData);
      this.loading = false;
      if (res.code === 200) {
        (this as any).$notification.success({
          message: '操作成功',
          description: `取消未付款订单${res.data.waitPay}单。取消超过截止时间未接单${res.data.autoCancel}单。订单自动完成${res.data.autoCompete}单`
        });
        this.$emit('ok', true);
        this.$emit('change', false);
      }
    }
  }
});
</script>
<style lang="less" scoped></style>
