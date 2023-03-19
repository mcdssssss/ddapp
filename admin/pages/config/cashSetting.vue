<template>
  <div class="home-container">
    <a-page-header title="提现设置"> </a-page-header>
    <div class="edit-content">
      <a-form-model ref="ruleForm" :model="formData">
        <div class="fo-20">支付宝提现</div>
        <a-row :gutter="20">
          <a-col :span="12">
            <a-form-model-item label="是否开启">
              <a-radio-group v-model="formData.alipay.open">
                <a-radio :value="true"> 开启 </a-radio>
                <a-radio :value="false"> 关闭 </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="提现方式">
              <a-radio-group v-model="formData.alipay.type">
                <a-radio value="handle"> 手动 </a-radio>
                <a-radio disabled value="auto"> 自动 (暂未支持)</a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
        </a-row>

        <a-divider></a-divider>

        <div class="fo-20">微信提现 <span class="fo-12 fo-9">(暂未支持)</span></div>
        <a-row :gutter="20">
          <a-col :span="12">
            <a-form-model-item label="是否开启">
              <a-radio-group v-model="formData.weixin.open">
                <a-radio disabled :value="true"> 开启 </a-radio>
                <a-radio disabled :value="false"> 关闭 </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="提现方式">
              <a-radio-group v-model="formData.weixin.type">
                <a-radio disabled value="auto"> 自动 </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
        </a-row>

        <a-divider></a-divider>

        <div class="fo-20">银行卡提现</div>
        <a-row :gutter="20">
          <a-col :span="12">
            <a-form-model-item label="是否开启">
              <a-radio-group v-model="formData.bank.open">
                <a-radio :value="true"> 开启 </a-radio>
                <a-radio :value="false"> 关闭 </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="提现方式">
              <a-radio-group v-model="formData.bank.type">
                <a-radio disabled value="handle"> 手动 </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
        </a-row>

        <a-form-model-item>
          <a-button type="primary" size="large" :loading="loading" @click="submit"
            >提交保存</a-button
          >
        </a-form-model-item>
      </a-form-model>
    </div>
  </div>
</template>
<script lang="ts">
import EditMixin from '@/plugins/mixins/edit-mixin.vue';

export default EditMixin.extend({
  layout: 'global',
  data() {
    return {
      formData: {
        alipay: {
          open: true,
          type: 'handle'
        },
        weixin: {
          open: false,
          type: 'auto'
        },
        bank: {
          open: true,
          type: 'handle'
        }
      },
      autoBack: false
    };
  },
  computed: {
    method(): string {
      return 'adminConfigCashSettingPost';
    }
  },
  mounted() {
    this.getConfig();
  },
  methods: {
    async getConfig() {
      const result = await (this as any).$api.adminConfigCashSettingGet();
      if (result.code === 200 && result.data) {
        this.formData = result.data;
      }
    }
  }
});
</script>
