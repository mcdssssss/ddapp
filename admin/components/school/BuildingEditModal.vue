<template>
  <a-modal
    :visible="visible"
    :title="type === 'add' ? '添加楼栋' : '修改楼栋'"
    :destroy-on-close="true"
    :confirm-loading="confirmLoading"
    ok-text="确定"
    cancel-text="取消"
    @ok="handleOk"
    @cancel="$emit('change', false)"
  >
    <div class="fo-14">楼栋名称:</div>
    <a-input v-model="formData.buildName" class="mt-12" placeholder="请输入楼栋名称"></a-input>

    <div class="fo-14 mt-20">备注:</div>
    <a-input v-model="formData.remark" class="mt-12" placeholder="请输入备注"></a-input>

    <div class="fo-14 mt-20">
      坐标: (请在
      <a href="https://lbs.qq.com/getPoint/" target="_blank">地图上拾取坐标</a>
      ，并将坐标复制到以下输入框)
    </div>
    <a-input v-model="formData.latlng" class="mt-12" placeholder="请输入纬度,经度"></a-input>
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
    type: {
      type: String,
      default: 'add'
    },
    areaId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      formData: {
        buildName: '',
        remark: '',
        areaId: this.areaId,
        schoolNo: this.$route.query.schoolNo,
        latlng: ''
      },
      confirmLoading: false
    };
  },
  methods: {
    async handleOk() {
      if (!this.formData.buildName) {
        (this as any).$message.error('请输入楼栋名称');
        return;
      }
      this.confirmLoading = true;
      if (this.type === 'add') {
        delete (this.formData as any).id;
      }
      const res = await (this as any).$api[
        this.type === 'add' ? 'schoolBuildAdd' : 'schoolBuildUpdate'
      ](this.formData);
      this.confirmLoading = false;
      if (res.code === 200) {
        this.$emit('success');
        this.$emit('change', false);
      }
    }
  }
});
</script>
<style lang="less" scoped></style>
