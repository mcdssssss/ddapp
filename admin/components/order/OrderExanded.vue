<template>
  <div class="fo-12">
    <a-row :gutter="20">
      <a-col :span="12">
        <div class="flex flex-start mt-12">
          <div>起点：</div>
          <div>
            <div v-if="startAddress !== '无地址信息'">
              {{ order.startAddress.contactName }}-{{ order.startAddress.mobileNumber }}
            </div>
            <div class="fo-9">{{ startAddress }}</div>
          </div>
        </div>
      </a-col>
      <a-col :span="12">
        <div class="flex flex-start mt-12">
          <div>终点：</div>
          <div>
            <div v-if="endAddress !== '无地址信息'">
              {{ order.endAddress.contactName }}-{{ order.endAddress.mobileNumber }}
            </div>
            <div class="fo-9">{{ endAddress }}</div>
          </div>
        </div>
      </a-col>

      <a-col :span="12">
        <div class="mt-12">详细信息:</div>
        <ErrandsInfo v-if="order.orderType === 'errands'" :price-details="order.priceDetails" />
        <RepairInfo v-else-if="order.orderType === 'repair'" :order="order" />
        <PrintInfo v-else-if="order.orderType === 'print'" :order="order" />
        <ClearInfo v-else-if="order.orderType === 'clear'" :order="order" />
        <MoveInfo v-else-if="order.orderType === 'move'" :order="order" />
        <PlayInfo v-else-if="order.orderType === 'play'" :order="order" />
        <ExpressInfo v-else-if="order.orderType === 'express'" :order="order" />
        <ShopGoodsInfo v-else-if="order.orderType === 'shop'" :order="order" />
        <div v-else-if="order.orderType === 'software'">
          {{ order.priceDetails.desc }}
        </div>
      </a-col>
      <a-col :span="12">
        <div class="mt-12">优惠信息:</div>
        <div v-if="order.discountDetails.length === 0" class="fo-9">无优惠信息</div>

        <a-row
          v-for="(item, index) in order.discountDetails"
          :key="index"
          class="fo-9 mt-8"
          :gutter="12"
        >
          <a-col :span="12">{{ item.label }}</a-col>
          <a-col :span="12">-{{ item.value }}元</a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import ErrandsInfo from '@/components/order/lib/ErrandsInfo.vue';
import PrintInfo from '@/components/order/lib/PrintInfo.vue';
import RepairInfo from '@/components/order/lib/RepairInfo.vue';
import ClearInfo from '@/components/order/lib/ClearInfo.vue';
import MoveInfo from '@/components/order/lib/MoveInfo.vue';
import PlayInfo from '@/components/order/lib/PlayInfo.vue';
import ExpressInfo from '@/components/order/lib/ExpressInfo.vue';
import ShopGoodsInfo from '@/components/order/lib/ShopGoodsInfo.vue';
export default Vue.extend({
  components: {
    ErrandsInfo,
    PrintInfo,
    RepairInfo,
    ClearInfo,
    MoveInfo,
    PlayInfo,
    ShopGoodsInfo,
    ExpressInfo
  },
  props: {
    order: {
      type: Object,
      default: () => {
        return {
          startAddress: {
            noneText: '',
            schoolNo: '',
            schoolBuild: {}
          },
          endAddress: {
            noneText: '',
            schoolNo: '',
            schoolBuild: {}
          },
          priceDetails: {},
          discountDetails: [],
          orderType: ''
        } as any;
      }
    }
  },
  computed: {
    startAddress(): string {
      return this.filterAddress(this.order.startAddress);
    },
    endAddress(): string {
      return this.filterAddress(this.order.endAddress);
    }
  },
  methods: {
    filterAddress(address: any): string {
      if (address.schoolNo) {
        const build = address.schoolBuild;
        return `${build.area} - ${build.build} - ${build.detail}`;
      } else if (address.province) {
        return `${address.province + address.city + address.district + address.detail}`;
      } else if (address.noneText) {
        return address.noneText;
      }
      return '无地址信息';
    }
  }
});
</script>
