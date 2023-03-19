<template>
  <view class="taker-register">
    <view class="fo-50">请填写以下信息</view>

    <view class="shadow mt-30 radius">
      <InputNumber
        :label="isLoad ? '姓名' : '名称'"
        :value="formData.realName"
        :placeholder="isLoad ? '请输入真实姓名' : '输入名称'"
        :maxlength="45"
        @change="formData.realName = $event"
      />
      <view class="split-line"></view>
      <InputNumber
        :label="isLoad ? '证件号码' : '号码'"
        :value="formData.idCard"
        icon="icon-student"
        :placeholder="isLoad ? '请输入证件号码' : '输入号码'"
        type="number"
        :maxlength="20"
        @change="formData.idCard = $event"
      />
      <view class="split-line"></view>
      <view class="p-30">
        <view class="flex flex-start item-center">
          <view class="iconfont icon-scard fo-28 fo-3"> </view>
          <view class="fo-28 fo-3 ml-30"
            >上传{{ isLoad ? "证件照片" : "图片" }}</view
          >
        </view>
        <StudentCard
          image="exam"
          :value="studentImage"
          @change="studentImage = $event"
        />
        <view v-if="isLoad" class="fo-24 fo-9 mt-20"
          >证件照片中需清晰展示证件号码、真实姓名和个人图像。且能够证明学籍。</view
        >
      </view>
    </view>
    <view class="mt-30 text-center">
      <checkbox-group @change="agreeChange">
        <label class="fo-26">
          <checkbox :checked="agree" />
          <view class="fo-24" style="display: inline"
            >我已阅读
            <view
              class="fo-info"
              style="display: inline"
              @click.stop="navToText"
              >《申请接单员协议》</view
            >,勾选表示同意协议</view
          >
        </label>
      </checkbox-group>
    </view>
    <view class="mt-30">
      <DButton type="theme" height="100rpx" @click="submit()">提交审核</DButton>
    </view>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
import InputNumber from "@/components/mine/InputItem.vue";
import StudentCard from "@/components/mine/taker/Student.vue";
import { upload, requestSubscribe } from "@/utils/common";
import { takerRegister, takerInfo } from "@/utils/api";
import { SCHOOL_TYPE } from "@/utils/constrants";
export default Vue.extend({
  components: {
    InputNumber,
    StudentCard,
  },
  data() {
    return {
      studentImage: "",
      avatarFaceImage: "",
      nationalFaceImage: "",
      formData: {
        realName: "",
        idCard: "",
        cardImages: {
          studentCard: "",
          avatarFaceImage: "", // 头像一面的身份证照片
          nationalFaceImage: "",
        },
      },
      agree: false,
      SCHOOL_TYPE,

      isLoad: false,
    };
  },

  mounted() {
    this.getInfo();
  },
  methods: {
    async getInfo() {
      uni.showLoading({ title: "检测中" });
      const result = await takerInfo();
      if (result.code !== 9999) {
        this.isLoad = true;
      }
      uni.hideLoading();
      if (result.code === 200 && result.data) {
        this.formData = {
          realName: result.data.realName,
          idCard: result.data.idCard,
          cardImages: result.data.cardImages,
        };
      }
    },
    agreeChange(e: any) {
      this.agree = e.detail.value.length === 1;
    },
    navToText() {
      uni.navigateTo({
        url: `/pages/text/text?richNo=${this.$store.state.config.takerAgreement}`,
      });
    },
    async submit() {
      if (!this.formData.realName) {
        uni.showToast({
          title: "请输入您的真实姓名",
          icon: "none",
        });
        return;
      } else if (!this.formData.idCard) {
        uni.showToast({
          title: "请输入学号",
          icon: "none",
        });
        return;
      } else if (!this.agree) {
        uni.showToast({
          icon: "none",
          title: "请同意勾选《申请跑男协议》",
        });
        return;
      }

      if (SCHOOL_TYPE === "school") {
        if (!this.formData.cardImages.studentCard && !this.studentImage) {
          uni.showToast({
            title: "请上传学生证",
            icon: "none",
          });
          return;
        }
        if (this.studentImage) {
          this.formData.cardImages.studentCard = (await upload(
            this.studentImage
          )) as string;
        }
      } else {
        if (
          !this.formData.cardImages.nationalFaceImage &&
          !this.nationalFaceImage
        ) {
          uni.showToast({
            title: "请上传身份证国徽一面",
            icon: "none",
          });
          return;
        }
        if (
          !this.formData.cardImages.avatarFaceImage &&
          !this.avatarFaceImage
        ) {
          uni.showToast({
            title: "请上传身份证个人头像一面",
            icon: "none",
          });
          return;
        }
        if (this.avatarFaceImage && this.nationalFaceImage) {
          this.formData.cardImages.avatarFaceImage = (await upload(
            this.avatarFaceImage
          )) as string;
          this.formData.cardImages.nationalFaceImage = (await upload(
            this.nationalFaceImage
          )) as string;
        }
      }

      // 配置订阅消息
      const storeTempIds = this.$store.state.config.tempIds;
      const tempids = [] as string[];
      if (storeTempIds.verifyResult) {
        tempids.push(storeTempIds.verifyResult);
      }
      await requestSubscribe(tempids);

      uni.showLoading({ title: "提交信息中" });

      // this.formData.cardImages.studentCard = this.studentImage;
      const result = await takerRegister(this.formData);
      uni.hideLoading();
      if (result.code === 200) {
        uni.showToast({
          title: result.msg,
          icon: "success",
          duration: 800,
        });
        const timeout = setTimeout(() => {
          uni.redirectTo({
            url: "/pages/mine/taker/status",
          });
          clearTimeout(timeout);
        }, 800);
      }
    },
  },
});
</script>
<style lang="scss" scoped>
.taker-register {
  padding: 30rpx;
  .split-line {
    width: 600rpx;
    height: 1rpx;
    margin-left: 90rpx;
    border-bottom: 1rpx solid #f3f3f3;
  }
}
</style>
