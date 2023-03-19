<template>
  <view class="service">
    <view class="service-content mt-60">
      <AddressBar
        start-placeholder="输入起点"
        :start="startAddress"
        end-placeholder="输入终点"
        :end="endAddress"
      />
    </view>
    <view
      class="service-main mt-60 shadow"
      :style="{ minHeight, paddingTop: '30rpx' }"
    >
      <view
        v-if="currentService && currentService.weightRules.length > 0"
        class="flex flex-between item-center pb-30"
      >
        <view class="bold fo-28 fo-3">物品重量(1~100)kg</view>
        <InputNumber
          :value="formData.weight"
          :max="100"
          @change="formData.weight = $event"
        />
      </view>
      <Desc
        :value="formData.desc"
        desc-placeholder="描述物品内容"
        :tags="currentService ? currentService.tags : []"
        @change="formData.desc = $event"
        @image="formData.image = $event"
      />

      <Annex ma="mt-30" @change="formData.images = $event" />

      <NextBtn @click="next()" />
    </view>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
import ServiceMixins from "@/mixins/service-mixin.vue";
import AddressBar from "@/components/service/components/AddressBar.vue";
import AddressBarSingle from "@/components/service/components/AddressBarSingle.vue";
import Desc from "@/components/service/components/Desc.vue";
import NextBtn from "@/components/service/components/NextBtn.vue";
import InputNumber from "@/components/service/components/InputNumber.vue";
import Annex from "@/components/service/components/Annex.vue";
export default Vue.extend({
  mixins: [ServiceMixins],
  components: {
    AddressBar,
    Desc,
    NextBtn,
    AddressBarSingle,
    InputNumber,
    Annex,
  },
  data() {
    return {
      weightCurrent: 0,
      formData: {
        weight: 1,
        desc: "",
        image: "",
        images: [],
      },
    };
  },
  onLoad() {},
  computed: {
    minHeight(): string {
      return "calc(100vh - 520rpx)";
    },
  },
  methods: {
    next() {
      if (
        !(this as any).startAddress.province &&
        !(this as any).startAddress.schoolNo
      ) {
        uni.showToast({
          title: "请选择一个起点地址",
          icon: "none",
        });
        return;
      }
      if (
        !(this as any).endAddress.province &&
        !(this as any).endAddress.schoolNo
      ) {
        uni.showToast({
          title: "请选择一个终点地址",
          icon: "none",
        });
        return;
      }

      if (!this.formData.desc) {
        uni.showToast({
          title: "请填写描述",
          icon: "none",
        });
        return;
      }
      (this as any).navToNext(this.formData, "double");
    },
  },
});
</script>
<style lang="scss">
@import url("~@/assets/style/service.scss");
</style>
