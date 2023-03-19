<template>
  <a-modal
    :visible="visible"
    :title="type === 'add' ? '添加快递项' : '修改快递项'"
    :destroy-on-close="true"
    ok-text="确定"
    cancel-text="取消"
    @ok="handleOk"
    @cancel="$emit('change', false)"
  >
    <a-form v-model="formData">
      <a-form-item label="名称">
        <a-input v-model="formData.name" placeholder="请输入名称"></a-input>
      </a-form-item>
      <a-form-item label="说明">
        <a-textarea v-model="formData.desc" placeholder="请输入说明" show-count :max-length="200" />
      </a-form-item>
      <a-form-item label="价格">
        <a-input-number
          v-model="formData.price"
          placeholder="请输入价格"
          style="width: 100%"
        ></a-input-number>
      </a-form-item>
    </a-form>
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
    }
  },
  data() {
    return {
      formData: {
        name: '',
        desc: '',
        price: 0
      }
    };
  },
  mounted() {},
  methods: {
    handleOk() {
      this.$emit('ok', this.formData);
    }
  }
});
</script>
<style lang="less" scoped></style>
