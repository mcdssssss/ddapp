<template>
  <div class="home-container">
    <div class="home-page-title">数据总览</div>
    <TotalData school />
    <!-- <BaseData /> -->
    <a-divider />
    <a-row class="mt-20" :gutter="20">
      <a-col :span="12">
        <UserLine />
      </a-col>
      <a-col :span="12">
        <TakerSort />
      </a-col>
    </a-row>
    <OrderLines />
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import TotalData from '@/components/overview/TotalData.vue';
import UserLine from '@/components/overview/UserLines.vue';
import TakerSort from '@/components/overview/TakerSort.vue';
import OrderLines from '@/components/overview/OrderLines.vue';
export default Vue.extend({
  components: {
    TotalData,
    UserLine,
    TakerSort,
    OrderLines
  },
  layout: 'global'
});
</script>
