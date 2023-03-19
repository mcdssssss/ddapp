<template>
  <view class="service">
    <view class="service-content mt-60">
      <AddressBarSingle
        type="end"
        :address="endAddress"
        placeholder="请选择您的地址"
      />
    </view>
    <view
      class="service-main mt-60 shadow"
      :style="{ paddingTop: '30rpx', minHeight: 'calc(100vh - 270rpx)' }"
    >
      <view class="flex flex-between item-center">
        <view class="bold fo-28 fo-3">选择快递件</view>
      </view>
      <ExpressItem
        v-for="(item, index) in express"
        :key="index"
        :options="item"
        :active="index === current"
        @click="current = index"
      />
      <Desc
        :value="desc"
        mt="30rpx"
        :descPlaceholder="'粘贴取件短信'"
        @change="desc = $event"
      />
      <view v-if="serviceDesc" class="mt-60 fo-9 fo-24"
        >服务说明：{{ serviceDesc }}</view
      >
      <NextBtn @click="next()" />
    </view>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
import ServiceMixins from "@/mixins/service-mixin.vue";
import AddressBarSingle from "@/components/service/components/AddressBarSingle.vue";
import ExpressItem from "@/components/service/express/ExpressItem.vue";
import Desc from "@/components/service/components/Desc.vue";
import NextBtn from "@/components/service/components/NextBtn.vue";
export default Vue.extend({
  mixins: [ServiceMixins],
  components: {
    AddressBarSingle,
    ExpressItem,
    NextBtn,
    Desc,
  },
  data() {
    return {
      current: 0,
      desc: "",
    };
  },
  onLoad(options: { label?: string }) {
    if (options.label) {
      uni.setNavigationBarTitle({
        title: options.label,
      });
    }
  },
  computed: {
    express(): any[] {
      if (
        (this as any).currentService &&
        (this as any).currentService.express
      ) {
        return (this as any).currentService.express;
      }
      return [];
    },
  },
  methods: {
    next() {
      if (
        !(this as any).endAddress.province &&
        !(this as any).endAddress.schoolNo
      ) {
        uni.showToast({
          title: "请选择一个地址",
          icon: "none",
        });
        return;
      }

      if (this.express.length === 0) {
        uni.showToast({
          title: "请至少选择一个选项",
          icon: "none",
        });
        return;
      }

      if (this.desc === "") {
        uni.showToast({
          title: "请输入描述",
          icon: "none",
        });
        return;
      }

      (this as any).navToNext(
        {
          expressObj: this.express[this.current],
          desc: this.desc,
        },
        "end"
      );
    },
  },
});
</script>
<style lang="scss">
@import url("~@/assets/style/service.scss");
</style>
