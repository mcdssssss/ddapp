<template>
  <a-modal
    :visible="visible"
    title="小程序设置"
    :destroy-on-close="true"
    ok-text="确定"
    cancel-text="取消"
    @ok="handleOk"
    @cancel="$emit('change', false)"
  >
    <div>小程序名称:</div>
    <a-input v-model="formData.appName" placeholder="请输入小程序名称"></a-input>
    <div class="mt-20">小程序访问地址:</div>
    <a-input
      v-model="formData.httpUrl"
      :disabled="isSass"
      placeholder="请输入小程序访问地址"
    ></a-input>
    <div class="fo-12 mt-12 fo-9">请确保小程序地址可以正常访问，以免审核失败。</div>
  </a-modal>
</template>
<script lang="ts">
import Vue from 'vue';
import { isSass } from '@/plugins/config';
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
        httpUrl: '',
        appName: ''
      },
      isSass: isSass()
    };
  },
  watch: {
    visible(e: boolean) {
      if (e) {
        this.info();
      }
    }
  },
  mounted() {
    this.formData.httpUrl = window.location.origin;
  },

  methods: {
    async info() {
      const result = await (this as any).$api.adminConfigMiniApp();
      if (result.code === 200 && result.data) {
        this.formData = result.data;
      }
    },
    handleOk() {
      if (!this.formData.httpUrl) {
        (this as any).$message.error('请输入小程序访问地址');
        return;
      }
      this.$emit('ok', this.formData);
    }
  }
});
</script>
<style lang="less" scoped></style>
