<template>
  <view class="order-detail p-30">
    <view class="flex flex-between item-center mb-30">
      <view class="flex flex-start item-center">
        <view class="avatar">
          <image
            class="avatar-image"
            :src="imageCenterCrop(info.userInfo.avatarUrl, 60, 60)"
            mode="aspectFill"
          ></image>
        </view>
        <DTag ma="ml-15" :type="info.orderType">{{
          info.priceDetails.subTitle
        }}</DTag>
        <DTag ma="ml-15">
          <i class="iconfont icon-naozhong mr-5"></i>
          {{ info.deadlineTime }}截止</DTag
        >
      </view>
      <view :class="['fo-32', statusText.color]">{{ statusText.text }}</view>
    </view>

    <view v-if="tempTime > 0" class="time-bar fo-24 fo-6">
      <text>剩余</text>
      <text class="fo-3 bold ml-12 mr-12">{{ mins }}:{{ second }}</text>
      订单自动关闭
    </view>

    <AddressBar
      :type="addressType"
      :nav="false"
      width
      :start="info.startAddress"
      :end="info.endAddress"
      :border="true"
      :canCall="
        info.taker === mineTakerNo ||
        info.userNo === userNo ||
        info.mchTakerNo === mineTakerNo
      "
    />

    <MchBar
      v-if="info.mchNo && info.mchTakerNo && info.mchType === 'print'"
      :info="info.mch"
      :status="info.mchStatus"
      :takeTime="info.mchTakeTime"
    />

    <TakerBar
      v-if="info.takerNo"
      :info="info.taker"
      :price="takerPrice"
      :status="info.status"
    />

    <view class="publish-content mt-30 shadow">
      <view class="fo-28"
        >详细信息
        <!-- <text class="bold">【{{ info.priceDetails.subTitle }}】</text> -->
      </view>
      <ErrandsInfo
        v-if="info.orderType === 'errands'"
        :info="info"
        :desc="info.priceDetails.desc"
        :image="info.priceDetails.image"
        :images="info.priceDetails.images"
      />
      <PrintInfo v-else-if="info.orderType === 'print'" :info="info" />
      <ClearInfo v-else-if="info.orderType === 'clear'" :info="info" />
      <PlayInfo v-else-if="info.orderType === 'play'" :info="info" />
      <SoftwareInfo v-else-if="info.orderType === 'software'" :info="info" />
      <MoveInfo v-else-if="info.orderType === 'move'" :info="info" />
      <RepairInfo v-else-if="info.orderType === 'repair'" :info="info" />
      <ExpressInfo v-else-if="info.orderType === 'express'" :info="info" />
      <CartInfo
        v-else-if="info.orderType === 'shop'"
        :carts="info.priceDetails.carts"
        :info="info"
      />
    </view>

    <view class="publish-card mt-30 shadow pl-30 pr-30 mb-30">
      <PubInfo v-if="info.fee > 0" label="小费" :value="`${info.fee || 0}元`" />
      <PubInfo label="备注" :value="`${info.remarks || '无'}`" />
    </view>

    <view class="publish-content mt-30 shadow">
      <view class="fo-28">订单信息 </view>
      <DetailInfo label="单号" :value="info.orderNo" :copy="true" />

      <DetailInfo
        v-if="info.createTime"
        label="创建时间"
        :value="formatDate(info.createTime, 'yyyy/MM/dd hh:mm:ss')"
      />
      <DetailInfo
        v-if="info.payTime"
        label="支付时间"
        :value="formatDate(info.payTime, 'yyyy/MM/dd hh:mm:ss')"
      />
      <DetailInfo
        v-if="info.sendTime"
        label="接单时间"
        :value="formatDate(info.sendTime, 'yyyy/MM/dd hh:mm:ss')"
      />
      <DetailInfo
        v-if="info.getTime"
        label="确认时间"
        :value="formatDate(info.getTime, 'yyyy/MM/dd hh:mm:ss')"
      />
      <DetailInfo
        v-if="info.successTime"
        label="完成时间"
        :value="formatDate(info.successTime, 'yyyy/MM/dd hh:mm:ss')"
      />
      <DetailInfo
        v-if="info.cancelTime"
        label="取消时间"
        :value="formatDate(info.cancelTime, 'yyyy/MM/dd hh:mm:ss')"
      />
      <DetailInfo
        v-if="info.closeTime"
        label="关闭时间"
        :value="formatDate(info.closeTime, 'yyyy/MM/dd hh:mm:ss')"
      />
      <DetailInfo
        v-if="info.refundTime"
        label="退款时间"
        :value="formatDate(info.refundTime, 'yyyy/MM/dd hh:mm:ss')"
      />
      <DetailInfo
        v-if="info.refundStatus === 1"
        label="退款金额"
        :value="info.refundAmount + '元'"
      />
      <DetailInfo
        v-if="info.cancelReason"
        label="取消理由"
        :value="info.cancelReason"
      />
    </view>
    <UserOpt
      v-if="
        (info.status === 0 ||
          info.status === 1 ||
          info.status === 2 ||
          info.status === 3) &&
        !isTaker
      "
      :no="info.orderNo"
      :mchStatus="info.mchStatus"
      :status="info.status"
      @refresh="getInfo(info.orderNo)"
    />
    <TakerOpt
      v-if="
        isTaker && (info.status === 1 || info.status === 2 || info.status === 3)
      "
      :status="info.status"
      :mchStatus="info.mchStatus"
      :no="info.orderNo"
      :takerNo="info.takerNo"
      :mchTakerNo="info.mchTakerNo"
      :self="
        (info.orderType === 'print' || info.orderType === 'shop') &&
        info.endAddress &&
        info.endAddress.noneText === '到店自取'
      "
      @refresh="getInfo(info.orderNo)"
    />
  </view>
</template>
<script lang="ts">
import Vue from "vue";
import AddressBar from "@/components/service/components/AddressBar.vue";
import { fetchOrderInfo } from "@/utils/api";
import { PublishAddressInterface } from "@/utils/constrants";
import ErrandsInfo from "@/components/service/errands/ErrandsInfo.vue";
import PlayInfo from "@/components/service/play/PlayInfo.vue";
import SoftwareInfo from "@/components/service/software/SoftwareInfo.vue";
import ExpressInfo from "@/components/service/express/ExpressInfo.vue";
import PubInfo from "@/components/publish/PubInfo.vue";
import { imageCenterCrop, formatDate } from "@/utils/common";
import { AUTOCANCELTIME } from "@/utils/constrants";
import TakerBar from "@/components/order/TakerBar.vue";
import DetailInfo from "@/components/order/DetailInfo.vue";
import UserOpt from "@/components/order/UserOpt.vue";
import TakerOpt from "@/components/order/TakerOpt.vue";
import MchBar from "@/components/order/MchBar.vue";
export default Vue.extend({
  components: {
    AddressBar,
    ErrandsInfo,
    PlayInfo,
    SoftwareInfo,
    PubInfo,
    TakerBar,
    DetailInfo,
    UserOpt,
    TakerOpt,
    MchBar,
    ExpressInfo,
  },
  data() {
    return {
      info: {
        orderNo: "",
        startAddress: {} as PublishAddressInterface,
        endAddress: {} as PublishAddressInterface,
        priceDetails: {
          subTitle: "",
          desc: "",
          totalPrice: 0,
          errandsPriceDetails: {} as any,
        },
        orderCountNo: 0,
        orderType: "",
        userInfo: {},
        deadlineTime: "",
        createTime: "",
        fee: 0,
        remarks: "",
        status: 0,
        mchStatus: 0,
        mchTakeTime: "",
        taker: {
          avatarUrl: "",
          nickName: "接单员",
        },
        mch: {
          name: "",
          image: "",
        },
      },
      isTaker: false,
      tempTime: 0,
      intv: null as null | number,
      mineTakerNo: uni.getStorageSync("takerNo"),
      isLoad: false,
      isPrint: false,
    };
  },
  computed: {
    userNo(): string {
      return this.$store.state.profile.userNo;
    },
    mins(): string {
      if (this.tempTime >= 60) {
        const m = parseInt(this.tempTime / 60 + "");
        if (m > 9) {
          return m + "";
        } else {
          return "0" + m;
        }
      } else {
        return "00";
      }
    },
    second(): string {
      const s = this.tempTime % 60;
      if (s > 9) {
        return s + "";
      } else {
        return "0" + s;
      }
    },
    addressType(): string {
      if (
        (this.info.startAddress.schoolNo ||
          this.info.startAddress.province ||
          this.info.startAddress.noneText) &&
        (this.info.endAddress.schoolNo ||
          this.info.endAddress.province ||
          this.info.endAddress.noneText)
      ) {
        return "double";
      } else if (
        (this.info.startAddress.schoolNo ||
          this.info.startAddress.province ||
          this.info.startAddress.noneText) &&
        !(
          this.info.endAddress.schoolNo ||
          this.info.endAddress.province ||
          this.info.endAddress.noneText
        )
      ) {
        return "start";
      } else {
        return "end";
      }
    },
    statusText(): { text: string; color: string } {
      switch (this.info.status) {
        case 0:
          return { text: "待付款", color: "fo-primary" };
        case 1:
          return { text: "等待接单", color: "fo-info" };
        case 2:
          return { text: "订单进行中", color: "fo-info" };
        case 3:
          return { text: "待确认完成", color: "fo-info" };
        case 4:
          return { text: "订单已完成", color: "fo-green" };
        case -1:
          return { text: "订单已关闭", color: "fo-3" };
        case -2:
          return { text: "订单已取消", color: "fo-9" };
        default:
          return { text: "", color: "" };
      }
    },
    takerPrice(): number {
      if (this.info.orderType === "print" || this.info.orderType === "shop") {
        if (this.info.priceDetails.errandsPriceDetails) {
          return this.info.priceDetails?.errandsPriceDetails.totalPrice;
        } else {
          return 0;
        }
      } else {
        return this.info.priceDetails.totalPrice;
      }
    },
    orderCountNo(): string {
      if (this.info.orderCountNo <= 0) {
        return "0";
      }
      if (this.info.orderCountNo < 10) {
        return "00" + this.info.orderCountNo;
      } else if (this.info.orderCountNo >= 10 && this.info.orderCountNo < 100) {
        return "0" + this.info.orderCountNo;
      } else {
        return this.info.orderCountNo + "";
      }
    },
  },
  onLoad(options: { orderNo: string; isTaker?: string; userNo?: string }) {
    this.getInfo(options.orderNo);
    this.isTaker = options.isTaker && options.isTaker === "1" ? true : false;
    if (options.userNo) {
      // 分享用户的userNo
      uni.setStorageSync("shareUserNo", options.userNo);
    }
  },
  onShow() {
    if (this.isLoad && this.info.orderNo) {
      this.getInfo(this.info.orderNo);
    }
  },
  onShareAppMessage(): any {
    const userNo = this.$store.state.profile.userNo;
    return {
      title: this.info.priceDetails.subTitle,
      path: `/pages/order/detail?isTaker=1&orderNo=${this.info.orderNo}${
        userNo ? "&userNo=" + userNo : ""
      }`,
    };
  },
  onHide() {
    this.clearIntv();
  },
  methods: {
    imageCenterCrop,
    formatDate,
    clearIntv() {
      clearInterval(this.intv as any);
      this.tempTime = 0;
    },
    setIntv() {
      this.intv = setInterval(() => {
        this.tempTime -= 1;
        if (this.tempTime <= 0) {
          this.clearIntv();
          this.getInfo(this.info.orderNo);
        }
      }, 1000);
    },
    async getInfo(orderNo: string) {
      uni.showLoading({ title: "加载中" });
      const result = await fetchOrderInfo({ orderNo });
      uni.hideLoading();
      if (result.code === 200) {
        if (result.data.status === 0) {
          const date = new Date(result.data.createTime);
          this.tempTime = parseInt(
            (date.valueOf() + AUTOCANCELTIME - Date.now()) / 1000 + ""
          );

          if (this.tempTime < 0) {
            this.tempTime = 0;
          } else {
            this.setIntv();
          }
        }
        this.info = result.data;
      }
      this.isLoad = true;
    },
  },
});
</script>
<style lang="scss" scoped>
.order-detail {
  .avatar {
    width: 60rpx;
    height: 60rpx;
    border-radius: 60rpx;
    background-color: #e1e1e1;
    .avatar-image {
      width: 60rpx;
      height: 60rpx;
      border-radius: 60rpx;
    }
  }
  .time-bar {
    padding: 20rpx;
    background-color: #f3f3f3;
    margin-bottom: 30rpx;
    border-radius: 8rpx;
  }
  .order-no-bar {
    padding: 20rpx;
    margin-bottom: 30rpx;
    font-size: 50rpx;
    position: relative;
    .print-btn {
      position: absolute;
      right: 0rpx;
      bottom: 0;
      width: 120rpx;
      height: 60rpx;
      font-size: 24rpx;
      line-height: 60rpx;
      background-color: $info;
      color: #ffffff;
      border-radius: 4rpx;
    }
  }
}
</style>
