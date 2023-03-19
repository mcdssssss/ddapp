<template>
  <view>
    <view class="publish">
      <view class="publish-back">
        <view class="publish-color"></view>
      </view>
      <AddressBar
        :type="addressType"
        :nav="false"
        width
        :start="calculateInfo.startAddress"
        :end="calculateInfo.endAddress"
      />
      <view class="publish-content mt-30 shadow">
        <view class="fo-28"
          >详细信息
          <text class="bold"
            >【{{ calculateInfo.priceDetails.subTitle }}】</text
          >
        </view>
        <ErrandsInfo
          v-if="serviceType === 'errands'"
          :info="calculateInfo"
          :desc="serviceDetails.desc"
          :image="serviceDetails.image"
          :images="serviceDetails.images"
        />
        <PlayInfo v-else-if="serviceType === 'play'" :info="calculateInfo" />
        <SoftwareInfo
          v-else-if="serviceType === 'software'"
          :info="calculateInfo"
        />
        <ExpressInfo
          v-else-if="serviceType === 'express'"
          :info="calculateInfo"
        />
      </view>
      <!-- <view class="publish-card mt-30 shadow">
        <CouponBtn
          :count="couponAbleCount"
          :label="couponName"
          :discount="couponDiscount"
          :price="calculateInfo.totalPrice"
        />
      </view> -->
      <view class="publish-card mt-30 shadow">
        <DatePicker
          :active="active"
          :value="formData.deadlineTime"
          @change="datePickerChange"
        />
        <view class="publish-line"></view>
        <LabelInput
          :value="formData.fee"
          label="小费"
          type="number"
          icon="icon-feiyongbaoxiaoshenqing-02"
          placeholder="输入小费，跑腿更积极"
          @change="
            formData.fee = $event;
            this.filterTotalPrice();
          "
        />
        <view class="publish-line"></view>
        <LabelInput
          :value="formData.remarks"
          label="备注"
          type="text"
          icon="icon-beizhu-biaozhu-04"
          placeholder="备注，给接单员留言"
          @change="formData.remarks = $event"
        />
      </view>
    </view>
    <PublishBtn :price="totalPrice" @publish="publish()" />
  </view>
</template>
<script lang="ts">
import Vue from "vue";
import AddressBar from "@/components/service/components/AddressBar.vue";
import InputNumber from "@/components/service/components/InputNumber.vue";
import LabelInput from "@/components/service/components/LabelInput.vue";
import ErrandsInfo from "@/components/service/errands/ErrandsInfo.vue";
import PlayInfo from "@/components/service/play/PlayInfo.vue";
import SoftwareInfo from "@/components/service/software/SoftwareInfo.vue";
import ExpressInfo from "@/components/service/express/ExpressInfo.vue";
import PublishBtn from "@/components/publish/PublishBtn.vue";
import CouponBtn from "@/components/publish/CouponBtn.vue";
import { calculate, Publish, publish } from "@/utils/api";
import { PublishAddressInterface } from "@/utils/constrants";
import DatePicker from "@/components/publish/DatePicker.vue";
import { pay } from "@/utils/pay";
import { upload, requestSubscribe } from "@/utils/common";
export default Vue.extend({
  components: {
    AddressBar,
    InputNumber,
    LabelInput,
    ErrandsInfo,
    PublishBtn,
    CouponBtn,
    DatePicker,
    PlayInfo,
    SoftwareInfo,
    ExpressInfo,
  },
  data() {
    return {
      active: 0,
      formData: {
        startAddress: this.$store.state.publish
          .startAddress as PublishAddressInterface,
        endAddress: this.$store.state.publish
          .endAddress as PublishAddressInterface,
        serviceDetails: this.$store.state.publish.serviceDetails
          ? JSON.parse(JSON.stringify(this.$store.state.publish.serviceDetails))
          : ({} as any),
        serviceNanoid: this.$store.state.publish.serviceNanoid as string,
        fee: "" as number | "",
        remarks: "" as string,
        userCouponId: 0 as number,
        deadlineTime: 0.5,
      } as Publish,
      calculateInfo: {
        totalPrice: 0,
        title: "",
        priceDetails: {},
        startAddress: {},
        endAddress: {},
      },
      totalPrice: 0,
      couponAbleCount: 0,
      couponName: "",
      couponDiscount: 0,
    };
  },
  computed: {
    serviceDetails(): any {
      return this.$store.state.publish.serviceDetails;
    },
    addressType(): string {
      console.log("===>", this.$store.state.publish.addressType);
      return this.$store.state.publish.addressType;
    },
    serviceType(): string {
      return this.$store.state.publish.serviceType;
    },
  },
  onShow() {
    uni.setNavigationBarColor({
      backgroundColor: "#333333",
      frontColor: "#ffffff",
    });
  },
  onHide() {
    this.$store.commit("clearPublish");
  },
  onLoad() {
    this.calculate();
  },
  methods: {
    datePickerChange({ active, value }: { active: number; value: number }) {
      this.active = active;
      this.formData.deadlineTime = value;
    },

    // 总价计算
    filterTotalPrice() {
      let num =
        this.calculateInfo.totalPrice +
        parseFloat((this.formData.fee || "0") as string) -
        this.couponDiscount;
      this.totalPrice = Math.floor(Math.round(num * 100)) / 100;
    },
    async calculate() {
      uni.showLoading({ title: "计算中" });
      const result = await calculate(this.formData);
      uni.hideLoading();
      if (result.code === 200) {
        this.calculateInfo = result.data;
        this.filterTotalPrice();
      }
    },
    async publish() {
      // 配置订阅消息
      const storeTempIds = this.$store.state.config.tempIds;
      const tempids = [] as string[];
      if (storeTempIds.orderReceive) {
        tempids.push(storeTempIds.orderReceive);
      }
      if (storeTempIds.orderComplete) {
        tempids.push(storeTempIds.orderComplete);
      }
      if (storeTempIds.orderCancel) {
        tempids.push(storeTempIds.orderCancel);
      }
      await requestSubscribe(tempids);
      uni.showLoading({ title: "发布中" });
      if (this.formData.serviceDetails.files) {
        uni.showLoading({ title: "正在上传文件" });
        const files = [] as string[];
        for (const item of this.formData.serviceDetails.files) {
          const url = (await upload(item.path, "print/")) as string;
          if (url) {
            files.push(url);
          } else {
            uni.showToast({
              title: "文件上传失败",
            });
            break;
          }
        }
        this.formData.serviceDetails.files = files;

        if (this.formData.serviceDetails.files.length === 0) {
          uni.showToast({
            title: "文件上传失败",
          });
          return;
        }
        uni.showLoading({ title: "发布中" });
      }

      if (this.formData.serviceDetails.image) {
        this.formData.serviceDetails.image = (await upload(
          this.formData.serviceDetails.image,
          "errands/"
        )) as string;
      }

      if (
        this.formData.serviceDetails.images &&
        this.formData.serviceDetails.images.length > 0
      ) {
        const images = [] as string[];
        for (const item of this.formData.serviceDetails.images) {
          const url = (await upload(item, "errands/")) as string;
          console.log(url);
          if (url) {
            images.push(url);
          } else {
            uni.showToast({
              title: "附件上传失败",
              icon: "none",
            });
            break;
          }
        }
        this.formData.serviceDetails.images = images;

        if (this.formData.serviceDetails.images.length === 0) {
          uni.showToast({
            title: "附件上传失败",
            icon: "none",
          });
          return;
        }
      }

      // 发布
      const result = await publish(this.formData);
      uni.hideLoading();
      if (result.code === 200) {
        const provider = uni.getStorageSync("provider");
        if (
          (provider !== "weixin" || !result.data.nonce_str) &&
          (provider !== "alipay" || !result.data.tradeNo)
        ) {
          uni.showToast({
            title: "发布成功",
            icon: "success",
            duration: 800,
          });
          const timeout = setTimeout(() => {
            uni.redirectTo({
              url: "/pages/order/detail?orderNo=" + result.data.orderNo,
            });
            clearTimeout(timeout);
          }, 800);
          return;
        } else {
          pay(result.data);
        }
      }
    },
  },
});
</script>
<style lang="scss" scoped>
.publish {
  padding: 30rpx;

  .publish-back {
    height: 1rpx;
    .publish-color {
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: 750rpx;
      height: 250rpx;
      background-image: linear-gradient(to bottom, #333333, #ffffff);
    }
  }
}
</style>
