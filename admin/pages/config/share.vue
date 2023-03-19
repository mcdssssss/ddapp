<template>
  <div class="home-container">
    <a-page-header title="分享设置"> </a-page-header>
    <div class="edit-content">
      <a-form-model ref="ruleForm" :model="formData" :rules="rules">
        <a-form-model-item label="分享标题">
          <a-input v-model="formData.title" placeholder="请输入分享标题"></a-input>
        </a-form-model-item>

        <a-form-model-item label="自定义分享描述">
          <a-input v-model="formData.desc" placeholder="请输入描述"></a-input>
        </a-form-model-item>

        <a-form-model-item label="页面 path ">
          <a-input v-model="formData.path" placeholder="请输入描述"></a-input>
          <div class="fo-12 fo-9">页面 path ，必须是以 / 开头的完整路径</div>
        </a-form-model-item>

        <a-form-model-item label="分享图标">
          <UploadImage v-model="formData.imageUrl" :height="160" :width="200"></UploadImage>

          <div class="fo-12 fo-9">
            路径可以是本地文件路径、代码包文件路径或者网络图片路径。显示图片长宽比是 5:4
          </div>
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
      formData: {
        title: '叮点跑腿',
        desc: '',
        path: '/pages/index/index',
        imageUrl: ''
      },
      autoBack: false
    };
  },
  computed: {
    method() {
      return 'adminSharePost';
    }
  },
  mounted() {
    this.getConfig();
  },
  methods: {
    async getConfig() {
      const result = await (this as any).$api.adminShareGet();
      if (result.code === 200) {
        this.formData = result.data;
      }
    }
  }
});
</script>
