<template>
  <view class="address-item" @click="$emit('choose', options)">
    <view class="flex flex-between item-center">
      <view class="flex flex-start item-center">
        <DTag v-if="options.isDefault" ma="mr-10">默认</DTag>
      </view>
      <view class="fo-24 fo-9">{{
        formatDate(options.updateTime, "MM/dd hh:mm")
      }}</view>
    </view>
    <view class="address-content">
      <view class="fo-6 fo-24 mt-15"
        >{{ options.schoolBuild.area }}-{{ options.schoolBuild.build }}-{{
          options.schoolBuild.detail
        }}</view
      >
      <view class="fo-3 fo-28 mt-5"
        >{{ options.contactName }},{{ options.mobileNumber }}</view
      >
    </view>
    <view class="edit-btn flex flex-end item-end" @click.stop="navToEdit">
      <image src="@/static/edit.png" mode="widthFix"></image>
    </view>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
import { formatDate } from "@/utils/common";
import { SchoolAddress } from "@/utils/api";
export default Vue.extend({
  props: {
    options: {
      type: Object,
      default: () => {
        return {
          addressNo: "",
          updateTime: "",
          schoolNo: "",
          contactName: "",
          mobileNumber: "",
          schoolBuild: undefined as SchoolAddress | undefined,
          province: "",
          city: "",
          district: "",
          detail: "",
        } as any;
      },
    },
  },
  computed: {
    schoolNo() {
      return this.$store.state.school.schoolNo;
    },
  },
  methods: {
    formatDate,
    navToEdit() {
      uni.navigateTo({
        url:
          "/pages/mine/address/edit?type=update&addressNo=" +
          this.options.addressNo,
      });
    },
  },
});
</script>
<style lang="scss" scoped>
.address-item {
  padding: 20rpx;
  box-shadow: 0 0 10rpx 0 rgba($color: #000000, $alpha: 0.1);
  border-radius: 8rpx;
  margin-bottom: 30rpx;
  position: relative;
  .address-content {
    width: 550rpx;
  }
  .edit-btn {
    width: 100rpx;
    height: 100rpx;
    position: absolute;
    right: 20rpx;
    bottom: 20rpx;
    text-align: right;
    image {
      width: 30rpx;
      height: 30rpx;
    }
  }
}
</style>
