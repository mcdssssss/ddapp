<template>
  <view class="service">
    <view class="service-content mt-60">
      <AddressBarSingle
        type="end"
        transfer
        transfer-text="远程陪练"
        placeholder="选择您的地址"
        :address="endAddress"
        @transferChange="endAddress = { noneText: $event }"
        @clearTransfer="endAddress = {}"
      />
    </view>
    <view
      class="service-main mt-60 shadow"
      style="min-height: calc(100vh - 270rpx); padding-top: 30rpx"
    >
      <ServiceRadio
        v-model="formData.playStyle"
        label="陪练方式"
        :options="playStyles"
        @change="formData.playStyle = $event"
      />

      <view class="flex flex-between item-center mt-60">
        <view class="bold fo-28 fo-3">{{ playValueLabel }}</view>
        <InputNumber
          :value="formData.playValue"
          @change="formData.playValue = $event"
        />
      </view>
      <Desc
        :value="formData.desc"
        mt="60rpx"
        :tags="currentService ? currentService.tags : []"
        @change="formData.desc = $event"
      />
      <view class="flex flex-between item-center mt-60">
        <view class="bold fo-28 fo-3">赏金</view>
        <InputNumber
          :value="formData.rewardAmount"
          :min="1"
          :max="500"
          @change="formData.rewardAmount = $event"
        />
      </view>

      <NextBtn @click="next()" />
    </view>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
import ServiceMixins from "@/mixins/service-mixin.vue";
import AddressBarSingle from "@/components/service/components/AddressBarSingle.vue";
import ServiceRadio from "@/components/service/components/ServiceRadio.vue";
import InputNumber from "@/components/service/components/InputNumber.vue";
import Desc from "@/components/service/components/Desc.vue";
import NextBtn from "@/components/service/components/NextBtn.vue";

export default Vue.extend({
  mixins: [ServiceMixins],
  components: {
    AddressBarSingle,
    ServiceRadio,
    InputNumber,
    Desc,
    NextBtn,
  },
  data() {
    return {
      formData: {
        playStyle: "time",
        playValue: 1,
        desc: "",
        rewardAmount: 5,
      },
      playStyles: [
        { label: "按对局数", value: "matchUp", match: "打几局(局)" },
        { label: "按时间", value: "time", match: "打多久(小时)" },
        { label: "按任务", value: "task", match: "任务数(个)" },
      ],
    };
  },
  computed: {
    playValueLabel(): string {
      for (const item of this.playStyles) {
        if (this.formData.playStyle === item.value) {
          return item.match;
        }
      }
      return "";
    },
  },
  onLoad(options: { label?: string }) {
    if (options.label) {
      uni.setNavigationBarTitle({
        title: options.label,
      });
    }
  },
  methods: {
    next() {
      if (
        !(this as any).endAddress.province &&
        !(this as any).endAddress.schoolNo &&
        !(this as any).endAddress.noneText
      ) {
        uni.showToast({
          title: "请选择一个地址或远程陪练",
          icon: "none",
        });
        return;
      }

      (this as any).navToNext(this.formData, "end");
    },
  },
});
</script>
<style lang="scss">
@import url("~@/assets/style/service.scss");
</style>
