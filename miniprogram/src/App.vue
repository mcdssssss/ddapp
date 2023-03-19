<script lang="ts">
import Vue from "vue";
import { mapMutations } from "vuex";
import { login } from "@/utils/common";
export default Vue.extend({
  mpType: "app",
  onLaunch() {
    login();
    // 获取平台名称
    uni.getProvider({
      service: "oauth",
      complete: (res) => {
        uni.setStorageSync("provider", res.provider[0]);
        this.setProvider(res.provider[0]);
      },
    });
    this.$store.dispatch("fetchSubscribe");
  },
  async onShow() {
    const schoolNo = uni.getStorageSync("schoolNo");
    if (!schoolNo) {
      uni.navigateTo({
        url: "/pages/location/location",
      });
      return;
    }
    if (schoolNo !== this.$store.state.school.schoolNo) {
      this.$store.commit("setSchoolNo", schoolNo);
      uni.showLoading({ title: "加载中" });
      await this.$store.dispatch("fetchSchoolInfo", schoolNo);
      uni.hideLoading();
    }
  },
  onHide() {
    console.log("App Hide");
  },
  methods: {
    ...mapMutations(["setProvider"]),
  },
});
</script>

<style lang="scss">
@import url("~@/assets/style/common.scss");
.shadow {
  box-shadow: 0 0 8rpx 0 rgba($color: #000000, $alpha: 0.1);
}
</style>
