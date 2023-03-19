<template>
  <div class="home-container">
    <a-page-header title="学校管理">
      <template #tags>
        <a-tag v-if="info.status === 1" color="green">运营中</a-tag>
        <a-tag v-else color="red">已暂停运营</a-tag>
      </template>
      <template #extra>
        <a-button key="update" type="link" @click="$router.push({ path: '/school/edit/update' })">
          <i class="iconfont icon-edit"></i> 修改信息</a-button
        >
      </template>
      <a-descriptions size="small" :column="5">
        <a-descriptions-item>
          <c-picture :src="info.schoolLogo" :width="70" :height="70"></c-picture>
        </a-descriptions-item>
        <a-descriptions-item>
          <a-descriptions size="small" :column="2">
            <a-descriptions-item label="学校名称">
              {{ info.schoolName }}
            </a-descriptions-item>
            <a-descriptions-item label="地址">
              {{ info.addressDetail }}
            </a-descriptions-item>
          </a-descriptions>
        </a-descriptions-item>
      </a-descriptions>
    </a-page-header>
    <a-tabs v-model="tabCurrent">
      <a-tab-pane key="server" tab="服务管理">
        <Service ref="service" />
      </a-tab-pane>
      <a-tab-pane key="carousel" tab="首页banner">
        <Carousel ref="carousel" />
      </a-tab-pane>
      <a-tab-pane key="floor" tab="楼栋管理">
        <Areas />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import dayjs from 'dayjs';
import Carousel from '@/components/school/Carousels.vue';
import Service from '@/components/school/Service.vue';
import Areas from '@/components/school/Areas.vue';
export default Vue.extend({
  components: {
    Service,
    Areas,
    Carousel
  },
  layout: 'global',
  data() {
    return {
      info: {
        schoolName: '',
        schoolLogo: '',
        status: 0,
        addressDetail: '',

        updateTime: new Date()
      } as any,
      tabCurrent: 'server'
    };
  },
  computed: {
    schoolNo(): string {
      return this.$route.query.schoolNo as string;
    },
    bulletinBoard(): boolean {
      return this.$store.state.system.bulletinBoard;
    },
    shop(): boolean {
      return this.$store.state.system.shop;
    }
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    dayjs,
    async getInfo() {
      const res = await (this as any).$api.schoolInfo({ schoolNo: this.schoolNo });
      if (res.code === 200 && res.data) {
        this.info = res.data;
        if (res.data.serviceData) {
          (this.$refs.service as any).sortStyleKey = res.data.serviceData.sortStyle;
          (this.$refs.service as any).iconInWhere = res.data.serviceData.iconInWhere;
          (this.$refs.service as any).services = res.data.serviceData.services;
          (this.$refs.service as any).slotCount = res.data.slotCount;
        }
      }
    }
  }
});
</script>
