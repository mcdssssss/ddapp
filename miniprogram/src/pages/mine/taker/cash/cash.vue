<template>
  <view class="cash">
    <view class="p-30">
      <view class="shadow p-60 radius">
        <view class="flex flex-start item-center">
          <view class="fo-28">账户余额</view>
          <view class="fo-50" style="margin-left: 100rpx"
            >{{ balanceAmount }} <text class="fo-26">元</text></view
          >
        </view>
        <view class="fo-28 mt-30">提现现金</view>
        <view class="py-30 border-b">
          <view class="flex flex-between item-center">
            <view class="fo-50">￥</view>
            <input
              placeholder="输入提现金额"
              type="digit"
              v-model="cashFee"
              placeholder-class="fo-28"
              @input="amountInput"
            />
            <view class="fo-3 fo-28" @click="cashFee = balanceAmount"
              >全部</view
            >
          </view>
        </view>
        <navigator
          class="py-30 flex flex-between item-center border-b"
          url="/pages/mine/taker/bank/bank?type=cash"
        >
          <view class="fo-30">
            <view class="fo-9" v-if="!bankCard.id">选择收款方式</view>
            <view v-if="bankCard.id">{{ bankCard.cardNo }}</view>
            <view class="fo-26 fo-9" v-if="bankCard.id"
              >{{ bankCard.bankName }} {{ bankCard.realname }}
            </view>
          </view>
          <view class="iconfont icon-arrow-right fo-28 fo-9"> </view>
        </navigator>
        <view class="mt-25 fo-9 fo-26"> 单笔提现最少10元，最多1000元。 </view>
        <button type="primary" class="mt-30" @click="submit()">
          提交提现申请
        </button>
      </view>
    </view>
    <view class="p-30 text-center fo-28 fo-9"
      >提现申请将在1-3个工作日内到账</view
    >
    <view class="p-30 flex flex-center">
      <button
        class="filter-btn fo-28 fo-info"
        style="margin: auto"
        open-type="contact"
      >
        联系客服
      </button>
      <button
        class="filter-btn fo-28 fo-6 ml-30"
        style="margin: auto"
        @click="navToRecord()"
      >
        提现记录
      </button>
    </view>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import { getBalance, cashRegister } from "@/utils/api";
export default Vue.extend({
  data() {
    return {
      cashFee: "" as string | number,
      bankCard: {
        bankNo: "",
      },
      balanceAmount: 0,
    };
  },
  onLoad() {
    this.getBlance();
  },
  methods: {
    navToRecord() {
      uni.navigateTo({
        url: "/pages/mine/taker/cash/record",
      });
    },
    amountInput(e: { detail: { value: string } }) {
      const value = parseFloat(e.detail.value);
      if (value > this.balanceAmount) {
        this.cashFee = this.balanceAmount;
      }
    },
    async getBlance() {
      uni.showLoading({
        title: "加载中",
      });
      const res = await getBalance();
      uni.hideLoading();
      if (res.code === 200) {
        this.balanceAmount = res.data;
      }
    },
    async submit() {
      if (!this.cashFee) {
        uni.showToast({
          title: "请输入提现金额",
          icon: "none",
        });
        return;
      } else if (this.cashFee > this.balanceAmount) {
        uni.showToast({
          title: "提现金额不得大于账户余额",
          icon: "none",
        });
        return;
      } else if (!this.bankCard.bankNo) {
        uni.showToast({
          title: "请选择提现方式",
          icon: "none",
        });
        return;
      }
      uni.showLoading({ title: "正在提交" });
      const params = {
        bankNo: this.bankCard.bankNo,
        amount:
          Math.floor(Math.round(parseFloat(this.cashFee + "") * 100)) / 100,
      };
      const res = await cashRegister(params);
      uni.hideLoading();
      if (res.code === 200) {
        uni.showToast({
          title: res.msg,
          icon: "success",
          duration: 800,
        });
        const timeout = setTimeout(() => {
          clearTimeout(timeout);
          uni.redirectTo({
            url: "/pages/mine/taker/cash/record",
          });
        }, 800);
      }
    },
  },
});
</script>
