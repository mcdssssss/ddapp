<template>
  <div class="home-container">
    <a-page-header title="添加接单员" @back="() => $router.go(-1)"> </a-page-header>
    <div class="edit-content">
      <a-form-model ref="ruleForm" :model="formData" :rules="rules">
        <a-form-model-item label="用户" prop="userNo">
          <ModalUser v-model="formData.userNo" />
        </a-form-model-item>

        <a-form-model-item label="真实姓名" prop="realName">
          <a-input v-model="formData.realName" placeholder="请输入真实姓名"></a-input>
        </a-form-model-item>

        <a-form-model-item label="学校名称" prop="schoolName">
          <a-input v-model="formData.schoolName" placeholder="请输入学校名称"></a-input>
          <div class="fo-12 fo-9">提示：必须和学生证上的学校名称一致</div>
        </a-form-model-item>

        <a-form-model-item label="学号" prop="idCard">
          <a-input v-model="formData.idCard" placeholder="请输入学号"></a-input>
        </a-form-model-item>

        <a-form-model-item label="上传学生证" prop="cardImages">
          <upload v-model="formData.cardImages.studentCard" :width="200" :height="120" />
          <a-input
            v-model="formData.cardImages.studentCard"
            placeholder="可直接输入学生证图片链接"
          ></a-input>
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
        takerType: 'school',
        userNo: '',
        idCard: '',
        realName: '',
        cardImages: {
          studentCard: '' // 学生证
        },
        schoolName: ''
      },
      rules: {
        takerType: [{ required: true, message: '接单员类型有误', trigger: 'blur' }],
        idCard: [{ required: true, message: '请输入学号', trigger: 'blur' }],
        realName: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
        cardImages: [{ required: true, message: '请上传学生证', trigger: 'blur' }],
        schoolName: [{ required: true, message: '请填写学生证上的学校名称', trigger: 'blur' }]
      }
    };
  },
  computed: {
    method(): string {
      return 'takerAdd';
    }
  }
});
</script>
