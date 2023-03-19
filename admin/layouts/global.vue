<template>
  <div class="global-container">
    <cHeader />
    <SidebarForSchool />
    <cMain>
      <nuxt></nuxt>
    </cMain>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import cHeader from '@/components/official/layout/Header.vue';
import SidebarForSchool from '@/components/official/layout/SidebarForSchool.vue';
import cMain from '@/components/official/layout/Main.vue';
export default Vue.extend({
  name: 'Global',
  components: {
    cHeader,
    SidebarForSchool,
    cMain
  },
  mounted() {
    this.getUserInfo();
  },
  computed: {
    version(): string {
      return this.$store.state.version;
    }
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
</style>
