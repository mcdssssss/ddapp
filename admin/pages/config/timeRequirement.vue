<template>
  <div class="home-container">
    <a-page-header title="时间要求配置"> </a-page-header>
    <div class="edit-content">
      <a-form-model ref="ruleForm" :model="formData" :rules="rules">
        <a-form-model-item label="时间配置规则(拖动可排序)">
          <draggable v-model="formData.timeRequirements" :animation="200" draggable=".move-item">
            <a-row
              v-for="(item, index) in formData.timeRequirements"
              :key="index"
              class="move-item mb-12"
            >
              <a-col :span="10">
                <a-input v-model="item.timeLabel" placeholder="请输入文本描述"></a-input>
              </a-col>
              <a-col :offset="2" :span="10">
                <a-input-number
                  v-model="item.timeValue"
                  placeholder="请填写最大时长"
                  :step="0.5"
                ></a-input-number>
              </a-col>
              <a-col :span="2">
                <a-button
                  type="danger"
                  shape="circle"
                  icon="delete"
                  @click="del(index, 'timeRequirements')"
                />
              </a-col>
            </a-row>
          </draggable>
          <a-button size="large" @click="addTimeRequirement">+ 添加一项</a-button>
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
import EditMixin from '@/plugins/mixins/edit-mixin.vue';
import ServiceMixin from '@/plugins/mixins/service-mixin.vue';

interface TimeRequirements {
  timeLabel: '';
  timeValue: number | null;
}
export default EditMixin.extend({
  layout: 'global',
  data() {
    return {
      formData: {
        timeRequirements: [] as TimeRequirements[]
      }
    };
  },
  mixins: [ServiceMixin],
  computed: {
    method() {
      return 'adminConfigTimeRequirementPost';
    }
  },
  mounted() {
    this.getConfig();
  },
  methods: {
    async getConfig() {
      const result = await (this as any).$api.adminConfigTimeRequirementGet();
      if (result.code === 200 && result.data) {
        this.formData = result.data;
      }
    },
    addTimeRequirement() {
      this.formData.timeRequirements.push({
        timeLabel: '',
        timeValue: null
      });
    },
    del(index: number, type: 'timeRequirements') {
      this.formData[type].splice(index, 1);
    }
  }
});
</script>
