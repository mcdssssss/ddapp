<template>
  <a-modal
    :visible="visible"
    title="移动到分组"
    :destroy-on-close="true"
    ok-text="确定"
    cancel-text="取消"
    :width="300"
    @ok="handleOk"
    @cancel="$emit('change', false)"
  >
    <a-select v-model="groupId" placeholder="选择分组" style="width: 100%">
      <a-select-option v-for="(item, index) in list" :key="index" :value="item.id">
        {{ item.groupName }}
      </a-select-option>
    </a-select>
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
      groupId: ''
    };
  },
  computed: {
    list(): any[] {
      return this.$store.state.file.list;
    }
  },
  mounted() {},
  methods: {
    async handleOk() {
      this.$emit('changeGroup', this.groupId);
    }
  }
});
</script>
<style lang="less" scoped></style>
