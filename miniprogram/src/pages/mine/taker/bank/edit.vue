<template>
  <view class="p-30">
    <view class="fo-50 mb-30">{{ labels.title || "完善信息" }}</view>

    <picker
      class="mt-30"
      :range="bankTypes"
      :value="active"
      range-key="label"
      @change="pickerChange"
    >
      <view class="pt-30 pb-30 flex flex-between item-center border-b">
        <view class="bold fo-40 fo-3">账户类型</view>
        <view class="flex flex-end item-center">
          <view class="fo-28 fo-6 mr-20">{{
            bankTypes[active] ? bankTypes[active].label : ""
          }}</view>
          <i class="iconfont icon-arrow-right fo-9 fo-24"></i>
        </view>
      </view>
    </picker>

    <input
      v-if="bankTypes[active] && bankTypes[active].value !== 'alipay'"
      class="fo-40 border-b mt-30 h-100"
      v-model="bankName"
      type="text"
      :placeholder="labels.bankName || '名称'"
    />

    <input
      class="fo-40 border-b mt-30 h-100"
      v-model="realname"
      type="text"
      :placeholder="labels.realName || '昵称'"
    />

    <input
      class="fo-40 border-b mt-30 h-100"
      v-model="cardNo"
      :placeholder="bankTypes[active] ? bankTypes[active].bankNo : '号码'"
    />

    <view class="py-30 fo-26 fo-9">{{ labels.desc }}</view>
    <view class="py-30 mt-30">
      <DButton type="theme" height="100rpx" @click="submit()">提交</DButton>
    </view>
    <view class="py-30" v-if="type === 'update'">
      <DButton type="danger" height="100rpx" @click="delBankCard()">{{
        labels.delBtn || "删除"
      }}</DButton>
    </view>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import { bankDel, bankAdd, bankUpdate, bankVerify } from "@/utils/api";
export default Vue.extend({
  components: {},
  data() {
    return {
      realname: "",
      cardNo: "",
      bankName: "",
      type: "add",
      bankNo: "",
      active: 0,
      labels: {
        desc: "",
        delBtn: "",
        title: "",
        bankName: "",
        realName: "",
        cardNo: "",
      },

      bankTypes: [],
    };
  },
  onLoad(options: {
    type: string;
    bankNo?: string;
    realname?: string;
    cardNo?: string;
    bankName?: string;
  }) {
    if (options.bankNo) {
      this.type = "update";
      this.realname = options.realname || "";
      this.cardNo = options.cardNo || "";
      this.bankName = options.bankName || "";
      this.bankNo = options.bankNo || "";
    }
    this.getBankVerify();
  },
  methods: {
    pickerChange(e: any) {
      this.active = e.detail.value;
      if ((this.bankTypes[this.active] as any).value === "alipay") {
        this.bankName = "支付宝";
      } else {
        this.bankName = "";
      }
    },
    delBankCard() {
      uni.showModal({
        title: "提示",
        content: "删除后数据无法恢复，确定要删除吗？",
        confirmText: "确定",
        complete: async (e) => {
          if (e.confirm) {
            uni.showLoading({
              title: "正在删除",
            });
            const res = await bankDel({
              bankNo: this.bankNo,
            });
            uni.hideLoading();
            if (res.code === 200) {
              uni.navigateBack({
                delta: 1,
              });
            }
          }
        },
      });
    },
    async getBankVerify() {
      uni.showLoading({ title: "加载中" });
      const result = await bankVerify();
      uni.hideLoading();
      if (result.code === 200 && result.data) {
        uni.setNavigationBarTitle({
          title:
            this.type === "add"
              ? "添加" + result.data.navBarTitle
              : "修改" + result.data.navBarTitle,
        });
        this.labels = result.data;
        this.bankTypes = result.data.bankTypes || [];
        if (this.type === "update" && this.bankName !== "支付宝") {
          const bankName = this.bankName;
          for (let i = 0; i < this.bankTypes.length; i++) {
            if ((this.bankTypes[i] as any).value !== "alipay") {
              this.pickerChange({ detail: { value: i } });
              this.bankName = bankName;
              break;
            }
          }
        } else {
          this.pickerChange({ detail: { value: 0 } });
        }
      }
    },
    async submit() {
      uni.showLoading({ title: "提交中" });
      const formData = {
        realname: this.realname,
        cardNo: this.cardNo,
        bankName: this.bankName,
      };
      if (this.type === "update") {
        (formData as any).bankNo = this.bankNo;
      }
      const res = await (this.type === "add"
        ? bankAdd(formData)
        : bankUpdate(formData as any));
      uni.hideLoading();
      if (res.code === 200) {
        uni.showToast({
          title: res.msg,
          icon: "success",
        });
        uni.navigateBack({
          delta: 1,
        });
      }
    },
  },
});
</script>
