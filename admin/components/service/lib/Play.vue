<template>
  <div>
    <a-form-model-item label="地址占位符">
      <a-input
        v-model="addressPlaceholder"
        placeholder="请输入地址占位符"
        @input="commonChange"
      ></a-input>
    </a-form-model-item>
    <a-form-model-item label="游戏快捷选项">
      <a-select
        v-model="tags"
        mode="tags"
        style="width: 100%"
        :token-separators="[',']"
        @change="commonChange"
      >
      </a-select>
      <div class="fo-12 fo-9">提示：输入一项按回车</div>
    </a-form-model-item>
  </div>
</template>
<script lang="ts">
import ServiceMixin from '@/plugins/mixins/service-mixin.vue';
export default ServiceMixin.extend({
  data() {
    return {
      addressPlaceholder: '',
      tags: [] as string[]
    };
  },
  methods: {
    async setFormData(data: any) {
      this.addressPlaceholder = data.addressPlaceholder;
      this.tags = data.tags;
    },
    getFormData() {
      return {
        tags: this.tags,
        addressPlaceholder: this.addressPlaceholder
      };
    }
  }
});
</script>
