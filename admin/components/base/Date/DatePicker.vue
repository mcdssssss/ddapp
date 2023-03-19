<template>
  <div class="flex flex-start item-center">
    <div>按时间查询:</div>
    <a-range-picker
      class="ml-8"
      :value="value"
      format="YYYY-MM-DD"
      value-format="YYYYMMDD"
      @change="dateChange"
    />
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import dayjs from 'dayjs';
export default Vue.extend({
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: Array,
      default: () => {
        return [dayjs(Date.now()).format('YYYYMMDD'), dayjs(Date.now()).format('YYYYMMDD')];
      }
    }
  },

  methods: {
    dateChange(e: string[]) {
      this.$emit('change', e);
    }
  }
});
</script>
