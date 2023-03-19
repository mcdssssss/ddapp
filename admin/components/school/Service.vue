<template>
  <div>
    <SortStyle
      v-model="sortStyleKey"
      :icon-in-where="iconInWhere"
      @in-where-change="iconInWhere = $event"
    />
    <div class="mt-20 service-box flex flex-start">
      <div class="service-main flex flex-center item-center">
        <div class="service-main-tip flex flex-start item-center">
          <div class="fo-12 fo-9 ml-12">提示：可拖动元素进行排序</div>
        </div>
        <a-tooltip>
          <template slot="title"> 添加服务 </template>
          <a-button class="service-add" type="primary" shape="circle" @click="addServiceItem()"
            >+</a-button
          >
        </a-tooltip>
        <draggable
          v-model="services"
          :class="['service-main-content', sortStyleKey]"
          :animation="200"
          draggable=".service-item"
        >
          <div
            v-for="(item, index) in services"
            :key="index"
            :class="['service-item', servicesCurrent === index ? 'service-item--active' : '']"
            @click="servicesCurrent = index"
          >
            <div class="service-icon flex flex-center item-center">
              <c-picture
                :src="item.image"
                :height="50"
                :width="50"
                :radius="50"
                noclick
              ></c-picture>
            </div>
            <div class="fo-12 mt-4">{{ item.label || '未命名' }}</div>
          </div>
        </draggable>
      </div>
      <UpdateServiceModel
        v-for="(item, index) in services"
        v-show="servicesCurrent === index"
        :key="index"
        :options="item"
        @del="
          servicesCurrent = -1;
          services.splice(index, 1);
        "
      />
      <div v-if="servicesCurrent === -1" class="service-edit-tip p-20">
        <div class="text-center fo-12 fo-9">请在左侧点击选择一项进行编辑</div>
      </div>
    </div>
    <div class="mt-20 flex flex-end item-center">
      <a-button type="primary" size="large" :loading="loading" @click="updateService"
        >保存修改</a-button
      >
    </div>
    <AddServiceModel ref="addService" v-model="addServiceVisible" @ok="addService" />
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import draggable from 'vuedraggable';
import SortStyle from '@/components/school/components/SortStyle.vue';
import AddServiceModel from '@/components/school/components/AddServiceModel.vue';
import UpdateServiceModel from '@/components/school/components/UpdateService.vue';
interface ServiceItem {
  type: string;
  label: string;
  image: string;
  serviceTempNo: string;
  extractForPlatform: number; // 平台抽点
  extractForAgent: number; // 代理抽点
  link: string;
}
export default Vue.extend({
  components: {
    // eslint-disable-next-line vue/no-unused-components
    SortStyle,
    AddServiceModel,
    draggable,
    UpdateServiceModel
  },
  data() {
    return {
      iconInWhere: 'underBanner',
      sortStyleKey: 'sort-4',
      addServiceVisible: false,
      services: [] as ServiceItem[],
      servicesCurrent: -1,
      loading: false,
      slotCount: 9
    };
  },
  methods: {
    addServiceItem() {
      this.addServiceVisible = true;
    },
    addService(service: ServiceItem) {
      (this.$refs.addService as any).formData = {
        type: '',
        label: '',
        image: '',
        serviceTempNo: '',
        extractForPlatform: 0, // 平台抽点
        extractForAgent: 0, // 代理抽点
        link: ''
      };
      this.services.push(JSON.parse(JSON.stringify(service)));
      this.servicesCurrent = this.services.length - 1;
      this.addServiceVisible = false;
    },
    async updateService() {
      this.loading = true;
      const res = await (this as any).$api.schoolUpdateService({
        schoolNo: this.$route.query.schoolNo,
        serviceData: {
          iconInWhere: this.iconInWhere,
          sortStyle: this.sortStyleKey,
          services: this.services
        }
      });
      this.loading = false;
      if (res.code === 200) {
        (this as any).$message.success(res.msg);
      }
    }
  }
});
</script>
<style lang="less" scoped>
.service-box {
  border: 1px solid #e1e1e1;

  .service-main {
    width: 500px;
    height: 500px;
    border-right: 1px solid #e1e1e1;
    position: relative;
    .service-main-tip {
      position: absolute;
      top: 0;
      left: 0;
      padding: 12px;
    }
    .service-add {
      position: absolute;
      top: 12px;
      right: 12px;
    }

    .service-main-content {
      width: 375px;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      .service-item {
        cursor: move;
        padding: 12px;
        text-align: center;
        transition: 0.2s linear background-color;
        border-radius: 4px;
        border: 1px solid #ffffff;
        &:hover {
          background-color: #f1f1f1;
        }
      }
      .service-item--active {
        border: 1px solid #955ce6;
      }
    }
    .sort-2 {
      cursor: move;
      .service-item {
        width: 50%;
      }
    }
    .sort-3 {
      .service-item {
        width: 33.33%;
      }
    }
    .sort-4 {
      .service-item {
        width: 25%;
      }
    }
  }
  .service-edit-tip {
    max-width: 500px;
    width: calc(100% - 500px);
    height: 500px;
    display: flex;
    align-items: center;
  }
}
</style>
