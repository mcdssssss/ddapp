<template>
  <div>
    <div>
      {{ item.serviceTemplateName }}
      <span v-if="item.desc" class="fo-12 fo-9">({{ item.desc }})</span>
    </div>
    <div>
      <a-row v-if="item.serviceType === 'errands'" :gutter="16">
        <a-col class="fo-9 fo-12" :span="12">起步价:{{ item.serviceContent.startPrice }}元</a-col>
        <a-col class="fo-9 fo-12" :span="12"
          >跑腿项:{{ item.serviceContent.errands.length }}项</a-col
        >
      </a-row>
      <a-row v-if="item.serviceType === 'repair'" :gutter="16">
        <a-col class="fo-9 fo-12" :span="12"
          >维修项:{{ item.serviceContent.repairs.length }}项</a-col
        >
        <a-col class="fo-9 fo-12" :span="12"
          >地址占位符:{{ item.serviceContent.addressPlaceholder }}</a-col
        >
      </a-row>
      <a-row v-if="item.serviceType === 'print'" :gutter="16">
        <a-col class="fo-9 fo-12" :span="12"
          >地址占位符:{{ item.serviceContent.addressPlaceholder }}</a-col
        >
      </a-row>
      <a-row v-if="item.serviceType === 'clear'" :gutter="16">
        <a-col class="fo-9 fo-12" :span="12"
          >清洁项:{{ item.serviceContent.clears.length }}项</a-col
        >
        <a-col class="fo-9 fo-12" :span="12"
          >地址占位符:{{ item.serviceContent.addressPlaceholder }}</a-col
        >
      </a-row>
      <a-row v-if="item.serviceType === 'move'" :gutter="16">
        <a-col class="fo-9 fo-12" :span="8">载具:{{ item.serviceContent.vehicles.length }}个</a-col>
        <a-col class="fo-9 fo-12 ell" :span="8"
          >起点占位符:{{ item.serviceContent.startAddressPlaceholder }}</a-col
        >
        <a-col class="fo-9 fo-12 ell" :span="8"
          >终点占位符:{{ item.serviceContent.endAddressPlaceholder }}</a-col
        >
      </a-row>
      <a-row v-if="item.serviceType === 'play'" :gutter="16">
        <a-col class="fo-9 fo-12 ell" :span="12"
          >标签:{{ item.serviceContent.tags.toString() }}</a-col
        >
        <a-col class="fo-9 fo-12" :span="12"
          >地址占位符:{{ item.serviceContent.addressPlaceholder }}</a-col
        >
      </a-row>
      <a-row v-if="item.serviceType === 'software'" :gutter="16">
        <a-col class="fo-9 fo-12 ell" :span="12"
          >标签:{{ item.serviceContent.tags.toString() }}</a-col
        >
        <a-col class="fo-9 fo-12" :span="12"
          >地址占位符:{{ item.serviceContent.addressPlaceholder }}</a-col
        >
      </a-row>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    item: {
      type: Object,
      default: () => ({} as any)
    }
  }
});
</script>
