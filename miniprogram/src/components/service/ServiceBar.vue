<template>
  <view :style="{ marginTop: top }">
    <view v-if="showTitle" class="service-title-bar">
      <view class="fo-28 bold ml-30 fo-3">校园服务</view>
    </view>
    <view class="flex flex-start item-center flex-wrap">
      <service-item
        v-for="(item, index) in services"
        :options="item"
        :sort="sort"
        :key="index"
        @click="navTo(item)"
      />
    </view>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
import ServiceItem from "@/components/service/ServiceItem.vue";
import { ServiceData } from "@/store/modules/school";
import { getServicePath } from "@/utils/common";
export default Vue.extend({
  components: {
    ServiceItem,
  },
  props: {
    top: {
      type: String,
      default: "30rpx",
    },
    showTitle: {
      type: Boolean,
      default: true,
    },
    sort: {
      type: String,
      default: "sort-4",
    },
  },
  data() {
    return {};
  },
  computed: {
    services(): ServiceData[] {
      return this.$store.state.school.services;
    },
  },
  methods: {
    navTo(item: ServiceData) {
      const userInfo = uni.getStorageSync("userInfo");
      if (!userInfo) {
        uni.navigateTo({
          url: "/pages/login/login",
        });
        return;
      }
      const path = getServicePath(item.type);
      let url = path;
      if (item.type === "link") {
        url = item.link as string;
      } else {
        url += `?nanoid=${item.nanoid}&label=${item.label}`;
      }
      console.log(item.type, url);
      uni.navigateTo({
        url,
      });
    },
  },
});
</script>
<style lang="scss" scoped>
.service-title-bar {
  position: relative;
}
</style>
