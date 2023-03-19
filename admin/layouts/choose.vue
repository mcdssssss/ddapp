<template>
  <div class="global-container">
    <cHeader />
    <div class="main">
      <nuxt></nuxt>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import cHeader from '@/components/official/layout/Header.vue';
export default Vue.extend({
  name: 'Global',
  components: {
    cHeader
  },
  mounted() {
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      this.$store.dispatch('profile/fetchUserInfo');
    }
  }
});
</script>
<style lang="less" scoped>
.global-container {
  width: 100vw;
  min-width: 1200px;
  height: 100vh;
  background-color: #f3f3f3;
  overflow: hidden;
}
.main {
  width: calc(100vw - 40px);
  min-width: calc(1200px - 40px);
  height: calc(100vh - 60px - 40px);
  position: absolute;
  top: 80px;
  left: 20px;
  background-color: #fff;
  border-radius: 4px;
}
</style>
