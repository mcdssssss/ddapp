<template>
  <a-modal
    :visible="value"
    title="修改真实姓名"
    :width="width"
    :footer="null"
    :destroy-on-close="true"
    @cancel="close"
  >
    <a-input v-model="real_name" placeholder="请输入真实姓名"></a-input>
    <div class="flex flex-end mt-40">
      <a-button @click="close">取消</a-button>
      <a-button class="ml-12" type="primary" :loading="loading" @click="submit">确认修改</a-button>
    </div>
  </a-modal>
</template>
<script lang="ts">
import ModalMixin from '@/plugins/mixins/modal-mixin.vue';
export default ModalMixin.extend({
  props: {
    name: {
      type: String,
      default: ''
    },
    no: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      real_name: this.name
    };
  },
  methods: {
    async submit() {
      this.loading = true;
      const res = await (this as any).$api.userUpdateRealname({
        user_no: this.no,
        real_name: this.real_name
      });
      this.loading = false;
      if (res.code === 200) {
        this.$emit('success');
      }
      this.close();
    }
  }
});
</script>
