<template>
  <view>
    <view class="fo-26 fo-3"
      >{{ options.mobileNumber }},{{ options.contactName }}</view
    >
    <view class="fo-6 fo-24 mt-5"
      >{{ options.schoolBuild.area }}-{{ options.schoolBuild.build }}-{{
        options.schoolBuild.detail
      }}</view
    >
  </view>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    address: {
      type: Object,
      default: () => {
        return {} as any;
      },
    },
  },
  computed: {
    options() {
      return this.address;
    },
  },
});
</script>
