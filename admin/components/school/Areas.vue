<template>
  <div>
    <div class="flex flex-between item-center">
      <div class="flex flex-start item-cencer">
        <a-button
          type="primary"
          size="large"
          @click="
            areaEditType = 'add';
            areaEditModalVisible = true;
            clearArea();
          "
          >添加区域</a-button
        >
      </div>
      <div class="flex flex-end item-center">
        <a-button size="large" icon="redo" :loading="loading" @click="getList()"> </a-button>
      </div>
    </div>

    <a-spin :spinning="loading">
      <div class="mt-20">
        <CEmpty v-if="list.length === 0">还有没有添加区域~</CEmpty>
        <div class="flex flex-start flex-wrap">
          <AreaItem
            v-for="(item, index) in list"
            :key="index"
            :options="item"
            @success="getList()"
            @update="updateArea"
          />
        </div>
      </div>
    </a-spin>
    <AreaEdit
      ref="areaModal"
      v-model="areaEditModalVisible"
      :type="areaEditType"
      @success="
        getList();
        areaEditModalVisible = false;
      "
    />
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import AreaItem from '@/components/school/AreaItem.vue';
import AreaEdit from '@/components/school/AreaEditModal.vue';
export default Vue.extend({
  components: {
    AreaItem,
    AreaEdit
  },
  data() {
    return {
      loading: false,
      list: [],
      areaEditModalVisible: false,
      areaEditType: 'add'
    };
  },
  computed: {
    title(): string {
      return this.$route.query.schoolName as string;
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    async getList() {
      this.loading = true;
      const res = await (this as any).$api.schoolAreaList({ schoolNo: this.$route.query.schoolNo });
      this.loading = false;
      if (res.code === 200) {
        this.list = res.data;
      }
    },
    updateArea(e: any) {
      this.areaEditType = 'update';
      this.areaEditModalVisible = true;
      (this.$refs as any).areaModal.formData = {
        areaName: e.areaName,
        status: e.status,
        schoolNo: e.schoolNo,
        id: e.id
      };
    },
    clearArea() {
      (this.$refs as any).areaModal.formData = {
        areaName: '',
        status: 0,
        schoolNo: this.$route.query.schoolNo
      };
    }
  }
});
</script>
