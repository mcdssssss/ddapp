<template>
  <view class="p-30">
    <view class="address-card">
      <InputItem
        :value="formData.contactName"
        label="姓名"
        icon="name"
        :maxlength="45"
        placeholder="请输入姓名"
        @change="formData.contactName = $event"
      />
      <view class="split-line"></view>
      <InputItem
        :value="formData.mobileNumber"
        label="手机号"
        icon="phone"
        type="number"
        :maxlength="11"
        placeholder="请输入11位手机号"
        @change="formData.mobileNumber = $event"
      />
    </view>

    <view class="address-card mt-30">
      <!-- 支付宝不支持多项选择 -->
      <AddressSchoolPicker
        :active="addressPickerIndex"
        :options="schoolAddress"
        @change="addressPickerIndex = $event"
        @locationChange="locationChange"
      />
      <view class="split-line"></view>
      <InputItem
        :value="formData.schoolBuild.detail"
        label="详细地址"
        icon="none"
        :maxlength="45"
        placeholder="请输入楼层/门牌号信息"
        @change="formData.schoolBuild.detail = $event"
      />
    </view>

    <view class="address-card mt-30">
      <AddressDefault
        :value="formData.isDefault"
        @change="formData.isDefault = $event"
      />
    </view>
    <view class="flex flex-center flex-wrap mt-100">
      <DButton
        type="theme"
        radius
        height="100rpx"
        width="570rpx"
        @click="submit"
        >提交保存</DButton
      >
      <DButton
        v-if="type === 'add'"
        class="mt-30"
        type="danger"
        radius
        height="100rpx"
        width="570rpx"
        @click="del"
        >删除地点</DButton
      >
    </view>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
import InputItem from "@/components/mine/InputItem.vue";
import AddressTab from "@/components/mine/AddressTab.vue";
import AddressSchoolPicker from "@/components/mine/AddressSchoolPicker.vue";
import AddressChooseLocation from "@/components/mine/AddressChooseLocation.vue";
import AddressDefault from "@/components/mine/AddressDetault.vue";
import AddressSchoolAreaPicker from "@/components/mine/AddressSchoolAreaPicker.vue";
import {
  getSchoolAddress,
  addressAdd,
  addressUpdate,
  addressDel,
  addressInfo,
} from "@/utils/api";
import { SchoolAddressOptions } from "@/utils/constrants";

export default Vue.extend({
  components: {
    InputItem,
    AddressTab,
    AddressSchoolPicker,
    AddressChooseLocation,
    AddressDefault,
    AddressSchoolAreaPicker,
  },
  data() {
    return {
      editType: "add",
      formData: {
        contactName: "",
        mobileNumber: "",
        province: "",
        city: "",
        district: "",
        detail: "",
        latitude: 0,
        longitude: 0,
        isDefault: false,
        schoolBuild: {
          detail: "",
        } as SchoolAddressOptions,
      },
      schoolInfo: {
        schoolName: "",
        schoolLogo: "",
      },
      schoolAddress: [],
      addressPickerIndex: [],
      addressNo: "",
      provider: uni.getStorageSync("provider"),
    };
  },

  onLoad(options: { type: "add" | "update"; addressNo: string }) {
    if (options.type) {
      this.editType = options.type;
      uni.setNavigationBarTitle({
        title: options.type === "add" ? "新增地址" : "修改地址",
      });
    }
    if (options.addressNo) {
      this.addressNo = options.addressNo;
      this.getAddressInfo();
    }
    this.getSchoolAddressInfo();
  },
  methods: {
    async submit() {
      if (!this.formData.contactName) {
        uni.showToast({
          title: "请输入姓名",
          icon: "none",
        });
        return;
      } else if (
        !this.formData.mobileNumber &&
        this.formData.mobileNumber.length !== 11
      ) {
        uni.showToast({
          title: "请输入11位手机号",
          icon: "none",
        });
        return;
      }
      if (this.addressPickerIndex.length > 1) {
        const area = this.schoolAddress[this.addressPickerIndex[0]] as any;
        const build = area.children[this.addressPickerIndex[1]] as any;
        (this.formData as any).schoolBuild = Object.assign(
          this.formData.schoolBuild,
          {
            area: area.areaName,
            areaId: area.id,
            build: build.buildName,
            buildId: build.id,
          }
        );
      }
      if (!this.formData.schoolBuild?.area) {
        uni.showToast({
          title: "请选择地址",
          icon: "none",
        });
        return;
      } else if (!this.formData.schoolBuild.detail) {
        uni.showToast({
          title: "请输入详细地址",
          icon: "none",
        });
        return;
      }
      uni.showLoading({
        title: "提交中..",
      });
      const result =
        this.editType === "add"
          ? await addressAdd(this.formData)
          : await addressUpdate(
              Object.assign(this.formData, {
                addressNo: this.addressNo,
              })
            );
      uni.hideLoading();
      if (result.code === 200) {
        uni.showToast({
          title: result.msg,
          icon: "success",
          duration: 800,
        });
        const timeout = setTimeout(() => {
          uni.navigateBack({
            delta: 1,
          });
          clearTimeout(timeout);
        }, 800);
      }
    },
    async del() {
      uni.showModal({
        title: "提示",
        content: "删除后数据无法恢复，确定要删除吗?",
        success: async (result) => {
          if (result.confirm) {
            uni.showLoading({ title: "删除中.." });
            const res = await addressDel({ addressNo: this.addressNo });
            uni.hideLoading();
            if (res.code === 200) {
              uni.showToast({
                title: res.msg,
                icon: "success",
                duration: 800,
              });
              const timeout = setTimeout(() => {
                uni.navigateBack({
                  delta: 1,
                });
                clearTimeout(timeout);
              }, 800);
            }
          }
        },
      });
    },
    locationChange(location: {
      latitude: number;
      longitude: number;
      province: string;
      city: string;
      district: string;
      street: string;
      street_number: string;
    }) {
      this.formData = Object.assign(this.formData, {
        province: location.province,
        city: location.city,
        district: location.district,
        detail: location.street + location.street_number,
        latitude: location.latitude,
        longitude: location.longitude,
      });
    },

    // 获取校园地址
    async getSchoolAddressInfo() {
      uni.showLoading({ title: "加载地址中" });
      const res = await getSchoolAddress();
      uni.hideLoading();
      if (res.code === 200) {
        this.schoolAddress = res.data;
      }
    },
    // 获取地址信息
    async getAddressInfo() {
      uni.showLoading({ title: "加载信息中" });
      const res = await addressInfo({ addressNo: this.addressNo });
      uni.hideLoading();
      if (res.code === 200) {
        this.formData = {
          contactName: res.data.contactName,
          mobileNumber: res.data.mobileNumber,
          province: res.data.province,
          city: res.data.city,
          district: res.data.district,
          detail: res.data.detail,
          latitude: res.data.latitude,
          longitude: res.data.longitude,
          isDefault: res.data.isDefault,
          schoolBuild: res.data.schoolBuild,
        };
        if (res.data.school) {
          this.schoolInfo = res.data.school;
        }
      }
    },
  },
});
</script>
<style lang="scss" scoped>
.address-card {
  box-shadow: 0 0 10rpx 0 rgba($color: #000000, $alpha: 0.1);
  background-color: #ffffff;
  border-radius: 8rpx;
}
.split-line {
  width: 600rpx;
  height: 1rpx;
  margin-left: 90rpx;
  border-bottom: 1rpx solid #e1e1e1;
}
</style>
