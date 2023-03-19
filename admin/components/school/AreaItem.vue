<template>
  <div class="school-area-item">
    <div class="area-item-header">
      <div class="fo-14 fo-3 bold-500 ell">{{ options.areaName }}</div>
      <div class="ml-8 opt-panel flex flex-center item-center">
        <a-tooltip>
          <template #title>添加楼栋</template>
          <a-button
            type="primary"
            shape="circle"
            size="small"
            @click="
              editType = 'add';
              buildVisible = true;
            "
          >
            +
          </a-button>
        </a-tooltip>

        <a-dropdown>
          <template #overlay>
            <a-menu @click="handleMoreClick">
              <a-menu-item key="update">修改</a-menu-item>
              <a-menu-item key="del">删除</a-menu-item>
            </a-menu>
          </template>
          <a-button class="ml-8" shape="circle" size="small">
            <i class="iconfont icon-more fo-12"></i>
          </a-button>
        </a-dropdown>
      </div>
    </div>
    <Scrollbar max-height="310px">
      <BuildingItem
        v-for="(item, index) in options.children"
        :key="index"
        :options="item"
        @refresh="$emit('success')"
        @update="buildUpdate"
      />
    </Scrollbar>
    <BuildingEditModal
      ref="buildModal"
      v-model="buildVisible"
      :area-id="options.id"
      :type="editType"
      @success="$emit('success')"
    />
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import BuildingEditModal from '@/components/school/BuildingEditModal.vue';
import BuildingItem from '@/components/school/BuildingItem.vue';
export default Vue.extend({
  components: {
    BuildingEditModal,
    BuildingItem
  },
  props: {
    options: {
      type: Object,
      default() {
        return {
          areaName: '',
          status: 0
        };
      }
    }
  },
  data() {
    return {
      editType: 'add',
      buildVisible: false
    };
  },
  methods: {
    handleMoreClick(e: { key: string }) {
      switch (e.key) {
        case 'update':
          this.$emit('update', this.options);
          break;
        case 'del':
          (this as any).$confirm({
            title: '提示',
            content: '确定要删除吗？删除数据无法恢复恢复。',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk: async () => {
              const result = await (this as any).$api.schoolAreaDel({ id: this.options.id });
              if (result.code === 200) {
                (this as any).$message.success('删除成功');
                this.$emit('success');
              }
            }
          });
          break;
      }
    },
    buildUpdate(e: any) {
      this.editType = 'update';
      this.buildVisible = true;
      (this.$refs as any).buildModal.formData = {
        id: e.id,
        buildName: e.buildName,
        remark: e.remark,
        areaId: this.options.id,
        schoolNo: this.$route.query.schoolNo
      };
    },
    buildClear() {
      (this.$refs as any).buildModal.formData = {
        buildName: '',
        remark: '',
        areaId: this.options.id,
        schoolNo: this.$route.query.schoolNo
      };
    }
  }
});
</script>
<style lang="less" scoped>
.school-area-item {
  width: 250px;
  height: 350px;
  border-radius: 4px;
  border: 1px solid #965ce621;
  transition: 0.2s linear border;
  overflow: hidden;
  margin-right: 20px;
  margin-bottom: 20px;
  .opt-panel {
    opacity: 0;
    transition: 0.2s linear opacity;
  }
  &:hover {
    border: 1px solid #955ce6;
    .opt-panel {
      opacity: 1;
    }
  }
  .area-item-header {
    transition: 0.2s linear border-bottom;
    height: 40px;
    background: #965ce621;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 12px;
  }
}
</style>
