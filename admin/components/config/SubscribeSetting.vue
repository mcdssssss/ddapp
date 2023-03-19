<template>
  <div class="config-content">
    <a-form-model ref="ruleForm" :model="formData" :rules="rules">
      <a-form-model-item label="用户订单通知" prop="orderTempId">
        <a-select
          v-model="formData.orderTempId"
          style="width: 100%"
          placeholder="输选择订单通知订阅消息模板"
        >
          <a-select-option
            v-for="(item, index) in subscribes"
            :key="index"
            :value="item.priTmplId"
            >{{ item.title }}</a-select-option
          >
        </a-select>
        <div class="mt-12 fo-12 fo-9">请对齐以下参数</div>
        <div class="flex flex-start">
          <div class="w-50">
            <draggable v-model="formData.orderKeys" :animation="200">
              <div
                v-for="(item, index) in formData.orderKeys"
                :key="index"
                class="set-item flex flex-between item-center"
              >
                <div>{{ item.label }}</div>
                <div class="iconfont icon-menu fo-12 fo-9"></div>
              </div>
            </draggable>
          </div>

          <div
            v-if="subscribes.find(item => item.priTmplId === formData.orderTempId)"
            class="w-50 subscribe-text"
          >
            <div
              v-for="(item, index) in subscribes
                .find(item => item.priTmplId === formData.orderTempId)
                .content.split('\n')"
              :key="index"
              class="ell"
            >
              {{ item }}
            </div>
          </div>
        </div>
      </a-form-model-item>

      <a-form-model-item label="跑男审核通知" prop="verifyTempId">
        <a-select
          v-model="formData.verifyTempId"
          style="width: 100%"
          placeholder="输选择审核通知订阅消息模板"
        >
          <a-select-option
            v-for="(item, index) in subscribes"
            :key="index"
            :value="item.priTmplId"
            >{{ item.title }}</a-select-option
          >
        </a-select>

        <div class="mt-12 fo-12 fo-9">请对齐以下参数</div>
        <div class="flex flex-start">
          <div class="w-50">
            <draggable v-model="formData.verifyKeys" :animation="200">
              <div
                v-for="(item, index) in formData.verifyKeys"
                :key="index"
                class="set-item flex flex-between item-center"
              >
                <div>{{ item.label }}</div>
                <div class="iconfont icon-menu fo-12 fo-9"></div>
              </div>
            </draggable>
          </div>

          <div
            v-if="subscribes.find(item => item.priTmplId === formData.verifyTempId)"
            class="w-50 subscribe-text"
          >
            <div
              v-for="(item, index) in subscribes
                .find(item => item.priTmplId === formData.verifyTempId)
                .content.split('\n')"
              :key="index"
              class="ell"
            >
              {{ item }}
            </div>
          </div>
        </div>
      </a-form-model-item>

      <!-- <a-form-model-item label="用户转发通知" prop="shareTempId">
        <a-select
          v-model="formData.shareTempId"
          style="width: 100%"
          placeholder="输选择转发通知订阅消息模板"
        >
          <a-select-option v-for="(item, index) in subscribes" :key="index" :value="item.title">{{
            item.title
          }}</a-select-option>
        </a-select>
      </a-form-model-item> -->

      <a-form-model-item>
        <a-button type="primary" size="large" :loading="loading" @click="submit">提交保存</a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import draggable from 'vuedraggable';
export default Vue.extend({
  components: {
    draggable
  },
  data() {
    return {
      formData: {
        type: '',
        orderTempId: '',
        verifyTempId: '',
        orderSendKeys: [] as string[],
        orderKeys: [
          { label: '状态', key: 'status' },
          { label: '订单号', key: 'orderNo' },
          { label: '服务类型(帮我送/帮我取/帮我买)', key: 'serviceType' },
          { label: '物品描述', key: 'goodsDesc' },
          { label: '创建时间', key: 'createTime' },
          { label: '下单时间', key: 'payTime' }
        ],
        verifySendKeys: [] as string[],
        verifyKeys: [
          { label: '审核时间', key: 'updateTime' },
          { label: '审核结果', key: 'status' },
          { label: '拒绝理由', key: 'refuseReason' }
        ]
      },
      rules: {
        orderTempId: [{ required: true, message: '输选择订单通知订阅消息模板', trigger: 'blur' }]
      },
      loading: false
    };
  },
  computed: {
    subscribes(): any[] {
      return this.$store.state.subscribe.mySubscribes;
    }
  },

  mounted() {
    if (this.$store.state.version) {
      this.formData.type = this.$store.state.version;
    }
    this.getauth();
  },
  methods: {
    async getauth() {
      const result = await (this as any).$api.adminNoticeGet({
        schoolType: this.$store.state.version
      });
      if (result.code === 200 && result.data) {
        this.formData = Object.assign(this.formData, result.data);
      }
    },
    submit() {
      (this.$refs as any).ruleForm.validate(async (valid: boolean) => {
        if (valid) {
          this.loading = true;
          // 解析
          const orderSplit = this.subscribes
            .find(item => item.priTmplId === this.formData.orderTempId)
            .content.split('\n');
          orderSplit.pop();
          for (const item of orderSplit) {
            const str = item.substring(item.indexOf('{{') + 2, item.indexOf('.DATA'));
            this.formData.orderSendKeys.push(str);
          }

          const verifySplit = this.subscribes
            .find(item => item.priTmplId === this.formData.verifyTempId)
            .content.split('\n');
          verifySplit.pop();
          for (const item of verifySplit) {
            this.formData.verifySendKeys.push(
              item.substring(item.indexOf('{{') + 2, item.indexOf('.DATA'))
            );
          }
          const result = await (this as any).$api.adminNoticePost(this.formData);
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
  .set-item {
    line-height: 30px;
    padding: 0 12px;
    border-radius: 4px;
    border: 1px solid #e1e1e1;
    margin-bottom: 8px;
    cursor: move;
  }
  .subscribe-text {
    line-height: 39px;
    padding-left: 12px;
  }
}
</style>
