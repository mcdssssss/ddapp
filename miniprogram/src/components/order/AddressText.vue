<template>
  <view class="flex flex-start item-center" :style="{ margin }">
    <Dot :type="type" size="small" />
    <view class="fo-6 fo-24 ml-20"
      >{{ options.schoolBuild.area }}-{{ options.schoolBuild.build }}-{{
        options.schoolBuild.detail
      }}</view
    >
  </view>
</template>
<script lang="ts">
import Vue from "vue";
import Dot from "@/components/service/components/Dot.vue";
export default Vue.extend({
  components: {
    Dot,
  },
  props: {
    type: {
      type: String,
      default: "start",
    },
    options: {
      type: Object,
      default: () => {
        return {} as any;
      },
    },
    margin: {
      type: String,
      default: "",
    },
  },
});
</script>
<style lang="scss" scoped></style>
