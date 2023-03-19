<template>
  <view>
    <scroll-view
      class="home-scroll-view"
      :style="{
        backgroundColor: iconInWhere === 'underBanner' ? '#f3f3f3' : '#ffffff',
      }"
      scroll-y
      :refresher-enabled="true"
      :refresher-triggered="isPulldown"
      @scroll="handleScroll"
      @refresherrefresh="refresherRefresh"
    >
      <LocationBar />
      <view :class="[iconInWhere === 'underBanner' ? 'top-layout' : '']">
        <view class="pl-30">
          <DSwiper :options="banners" />
        </view>
        <ServiceBar
          v-if="iconInWhere === 'underBanner'"
          :top="bulletinBoardShow ? '0rpx' : '30rpx'"
          :show-title="false"
          :sort="sortStyle"
        />
      </view>
      <ServiceTab
        v-if="iconInWhere === 'fixBtn'"
        :active="query.orderType"
        :fixed="scrollTop >= serviceTabScroll"
        @change="
          query.orderType = $event;
          getList();
        "
      />

      <view class="p-30">
        <ServiceTitleBar
          v-if="iconInWhere === 'underBanner' && list.length > 0"
          title="任务大厅"
          icon="icon-task"
          ma="mb-30"
        />
        <OrderItem
          v-for="(item, index) in list"
          :key="index"
          type="taker"
          :options="item"
          @takeSuccess="getList"
        />
        <view
          v-if="list.length === 0 && iconInWhere !== 'underBanner'"
          class="pb-30"
        >
          <DEmpty type="shop">还没有任务哦!</DEmpty>
        </view>
      </view>
      <Watermark />
    </scroll-view>
    <ServiceBtn v-if="iconInWhere === 'fixBtn'" />
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import DSwiper from "@/components/base/swiper/Swiper.vue";
import LocationBar from "@/components/location/LocationBar.vue";
import ServiceTab from "@/components/service/ServiceTab.vue";
import OrderItem from "@/components/order/OrderItem.vue";
import ServiceBtn from "@/components/service/ServiceBtn.vue";
import { fetchOrderSchoolList, fetchSchoolCarousel } from "@/utils/api";
import { ServiceData } from "@/store/modules/school";
import ServiceBar from "@/components/service/ServiceBar.vue";
import ServiceTitleBar from "@/components/service/TitleBar.vue";
export default Vue.extend({
  components: {
    DSwiper,
    LocationBar,
    OrderItem,
    ServiceTab,
    ServiceBtn,
    ServiceBar,
    ServiceTitleBar,
  },
  data() {
    return {
      query: {
        current: 1,
        pageSize: 15,
        orderType: "",
      },
      list: [],
      count: 0,
      banners: [],
      scrollTop: 0,
      isPulldown: false,
    };
  },
  computed: {
    schoolNo(): string {
      return this.$store.state.school.schoolNo;
    },
    services(): ServiceData[] {
      return this.$store.state.school.services;
    },
    iconInWhere(): string {
      return this.$store.state.school.iconInWhere;
    },
    sortStyle(): string {
      return this.$store.state.school.sortStyle;
    },
    serviceTabScroll(): number {
      let sc = 140;
      return sc;
    },
  },
  onLoad(options: { userNo?: string }) {
    this.getCarouselInfo();
    this.getSchoolInfo();
    if (options.userNo) {
      // 分享用户的userNo
      uni.setStorageSync("shareUserNo", options.userNo);
    }
  },

  onShow() {
    this.getList();
  },
  onReachBottom() {
    if (this.list.length < this.count) {
      this.getList(true);
    }
  },
  onPullDownRefresh() {
    this.getCarouselInfo();
    this.getSchoolInfo();
    this.getList();
    this.isPulldown = true;
  },
  // 分享给朋友
  onShareAppMessage() {
    const userNo = this.$store.state.profile.userNo;
    return {
      path: `/pages/index/index${userNo ? "?userNo=" + userNo : ""}`,
    };
  },
  // 分享到朋友圈
  onShareTimeline(): any {
    const userNo = this.$store.state.profile.userNo;
    return {
      query: userNo ? "userNo=" + userNo : "",
    };
  },
  methods: {
    refresherRefresh() {
      this.getCarouselInfo();
      this.getSchoolInfo();
      this.getList();
      this.isPulldown = true;
    },
    handleScroll(e: any) {
      this.scrollTop = e.target.scrollTop;
    },
    async getCarouselInfo() {
      const result = await fetchSchoolCarousel();
      if (result.code === 200) {
        this.banners = result.data;
      }
    },
    async getList(isBottom = false) {
      if (isBottom) {
        this.query.current += 1;
      } else {
        this.query.current = 1;
      }
      uni.showLoading({ title: "加载中" });
      const result = await fetchOrderSchoolList(Object.assign(this.query));
      uni.hideLoading();
      uni.stopPullDownRefresh();
      this.isPulldown = false;
      if (result.code === 200) {
        if (isBottom) {
          this.list = this.list.concat(result.data.data);
        } else {
          this.list = result.data.data;
        }
        this.count = result.data.count;
      }
    },
    async getSchoolInfo() {
      uni.showLoading({ title: "加载中" });
      await this.$store.dispatch("fetchSchoolInfo");
      uni.hideLoading();
      uni.stopPullDownRefresh();
    },
  },
});
</script>

<style>
.home-scroll-view {
  height: 100vh;
  background-color: #f3f3f3;
}
.top-layout {
  background-color: #ffffff;
  padding-bottom: 30rpx;
  border-radius: 0 0 60rpx 60rpx;
}
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin: 200rpx auto 50rpx auto;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
