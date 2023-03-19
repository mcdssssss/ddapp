<template>
  <div>
    <div class="config-content">
      <a-form-model ref="ruleForm" :model="formData" :rules="rules">
        <div class="flex flex-between item-center">
          <div class="bold">微信订阅消息配置</div>
          <a
            href="https://gitee.com/landalfyao/ddrun/wikis/pages?sort_id=5948451&doc_id=403865"
            target="_blank"
            >帮助</a
          >
        </div>

        <a-form-model-item label="订单完成模板ID" prop="orderComplete">
          <a-input v-model="formData.orderComplete" placeholder="请输入订单完成模板ID" />
          <div class="fo-12 fo-9">关键字排序:订单编号、订单类型、订单状态、完成时间、订单内容</div>
        </a-form-model-item>
        <a-form-model-item label="订单完成详细内容字段">
          <a-select
            v-model="formData.orderCompleteKeys"
            placeholder="填入订单完成详细内容字段，按回车填入下一个"
            mode="tags"
            style="width: 100%"
          >
          </a-select>
          <div class="fo-12 fo-9">请根据关键字排序依次输入对应字段。按回车填入下一个</div>
        </a-form-model-item>

        <a-form-model-item label="订单取消模板ID" prop="orderCancel">
          <a-input v-model="formData.orderCancel" placeholder="请输入订单取消模板ID" />
          <div class="fo-12 fo-9">关键字排序:订单编号、订单状态、订单类型、取消理由、取消时间</div>
        </a-form-model-item>

        <a-form-model-item label="订单取消详细内容字段">
          <a-select
            v-model="formData.orderCancelKeys"
            placeholder="填入订单取消详细内容字段，按回车填入下一个"
            mode="tags"
            style="width: 100%"
          >
          </a-select>
          <div class="fo-12 fo-9">请根据关键字排序依次输入对应字段。按回车填入下一个</div>
        </a-form-model-item>

        <a-form-model-item label="订单接单模板ID" prop="orderReceive">
          <a-input v-model="formData.orderReceive" placeholder="请输入订单接单模板ID" />
          <div class="fo-12 fo-9">关键字排序:订单号、操作人、操作时间、订单金额</div>
        </a-form-model-item>

        <a-form-model-item label="订单接单详细内容字段">
          <a-select
            v-model="formData.orderReceiveKeys"
            placeholder="填入订单接单详细内容字段，按回车填入下一个"
            mode="tags"
            style="width: 100%"
          >
          </a-select>
          <div class="fo-12 fo-9">请根据关键字排序依次输入对应字段。按回车填入下一个</div>
        </a-form-model-item>

        <a-form-model-item label="审核结果通知模板ID" prop="verifyResult">
          <a-input v-model="formData.verifyResult" placeholder="请输入审核结果通知模板ID" />
          <div class="fo-12 fo-9">关键字排序:审核结果、备注、审核状态、审核时间</div>
        </a-form-model-item>

        <a-form-model-item label="审核结果通知详细内容字段">
          <a-select
            v-model="formData.verifyResultKeys"
            placeholder="填入审核结果通知详细内容字段，按回车填入下一个"
            mode="tags"
            style="width: 100%"
          >
          </a-select>
          <div class="fo-12 fo-9">请根据关键字排序依次输入对应字段。按回车填入下一个</div>
        </a-form-model-item>

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
import Vue from 'vue';
export default Vue.extend({
  data() {
    return {
      formData: {
        orderComplete: '',
        orderCancel: '',
        orderReceive: '',
        verifyResult: '',
        orderCompleteKeys: [] as string[],
        orderCancelKeys: [] as string[],
        orderReceiveKeys: [] as string[],
        verifyResultKeys: [] as string[]
      },
      rules: {
        orderComplete: [{ required: true, message: '输入订单完成模板ID', trigger: 'blur' }],
        orderCancel: [{ required: true, message: '输入订单取消模板ID', trigger: 'blur' }],
        orderReceive: [{ required: true, message: '输入订单接单模板ID', trigger: 'blur' }],
        verifyResult: [{ required: true, message: '输入审核结果通知模板ID', trigger: 'blur' }]
      },
      loading: false
    };
  },
  mounted() {
    this.getauth();
  },
  methods: {
    async getauth() {
      const result = await (this as any).$api.adminWxSubscribeGet();
      if (result.code === 200 && result.data) {
        this.formData = Object.assign(this.formData, result.data);
      }
    },
    submit() {
      (this.$refs as any).ruleForm.validate(async (valid: boolean) => {
        if (valid) {
          this.loading = true;
          const result = await (this as any).$api.adminWxSubscribePost(this.formData);
          this.loading = false;
          if (result.code === 200) {
            (this as any).$message.success(result.msg);
          }
        } else {
          return false;
        }
      });
    }
  }
});
</script>
<style lang="less" scoped>
.config-content {
  width: 500px;
  margin: auto;
  padding-top: 80px;
}
</style>
