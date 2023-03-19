<template>
  <div class="home-container">
    <a-page-header :title="title + '富文本'" @back="() => $router.go(-1)"> </a-page-header>
    <div class="edit-content" style="width: 800px">
      <a-form-model ref="ruleForm" :model="formData" :rules="rules">
        <a-form-model-item label="文本标题" prop="richTitle">
          <a-input v-model="formData.richTitle" placeholder="请输入文本标题"></a-input>
        </a-form-model-item>

        <a-form-model-item label="文本图片" prop="richImage">
          <UploadImage v-model="formData.richImage" :height="160" :width="200"></UploadImage>
        </a-form-model-item>

        <a-form-model-item label="文本内容" prop="richContent">
          <FEditor ref="editor" v-model="formData.richContent" :width="800"></FEditor>
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
export default EditMixin.extend({
  layout: 'global',
  data() {
    return {
      visible: false,
      formData: {
        richImage: '',
        richTitle: '',
        richContent: '',
        groupId: undefined as undefined | number
      },
      rules: {
        richTitle: [{ required: true, message: '标题必填', trigger: 'blur' }],
        richImage: [{ required: true, message: '图片必填', trigger: 'blur' }],
        richContent: [{ required: true, message: '文本必填', trigger: 'blur' }]
      },
      fixdBack: true
    };
  },
  computed: {
    method(): string {
      return this.isAdd ? 'richtextAdd' : 'richtextUpdate';
    }
  },
  mounted() {
    const query = this.$route.query;
    if (query.richNo) {
      this.getInfo(query.richNo as string);
    }
  },
  methods: {
    async getInfo(richNo: string) {
      const res = await (this as any).$api.richtextInfo({ richNo });
      if (res.code === 200) {
        this.formData = {
          richImage: res.data.richImage,
          richTitle: res.data.richTitle,
          richContent: res.data.richContent,
          groupId: res.data.groupId
        };
        (this.formData as any).richNo = res.data.richNo;
        (this.$refs.editor as any).setContent(res.data.richContent);
      }
    },
    submit() {
      (this.$refs as any).ruleForm.validate(async (valid: boolean) => {
        if (valid) {
          this.loading = true;
          const result = await (this as any).$api[this.method](this.formData);
          this.loading = false;
          if (result.code === 200) {
            await this.$store.dispatch('file/fetchRichtextList');
            this.$router.go(-1);
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
.move-item {
  width: 100%;
  min-height: 60px;
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.08);
  margin-top: 10px;
}
</style>
