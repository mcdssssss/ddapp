<template>
  <div class="home-container">
    <div class="home-page-title">资金走向列表</div>
    <Search class="mt-20" :options="searchOptions" @change="searchChange" />
    <div class="flex flex-between item-center">
      <div class="flex flex-start item-cencer">
        <!-- <a-button type="primary" size="large" @click="$router.push('/user/edit/add')"
          >添加用户</a-button
        > -->
      </div>
      <div class="flex flex-end item-center">
        <a-button size="large" icon="redo" :loading="loading" @click="getTableData()"> </a-button>
      </div>
    </div>
    <a-table
      class="mt-20"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      :row-key="rowKey"
      :columns="columns"
      :data-source="tabelData"
      :pagination="false"
      :loading="loading"
      bordered
    >
      <template slot="orderNo" slot-scope="text">
        <div class="fo-12" style="width: 100px">{{ text.orderNo }}</div>
      </template>

      <template slot="platformIncome" slot-scope="text">
        <div>{{ text.platformIncome }}元</div>
      </template>

      <template slot="takerIncome" slot-scope="text">
        <div>{{ text.takerIncome }}元 <taker-link class="ml-8" :no="text.takerNo" /></div>
      </template>

      <template slot="createTime" slot-scope="text">
        <div class="fo-12">{{ dayjs(text.createTime).format('YYYY/MM/DD HH:mm') }}</div>
      </template>
    </a-table>
    <div class="mt-20 flex flex-end">
      <a-pagination
        v-model="query.current"
        size="small"
        :total="count"
        :page-size="query.pageSize"
        show-quick-jumper
        :show-total="total => `共 ${total} 条数据`"
        @change="pageChange"
      />
    </div>
  </div>
</template>
<script lang="ts">
import TableDataMixins from '@/plugins/mixins/table-data-mixin.vue';
export default TableDataMixins.extend({
  data() {
    return {
      /* ---- 必要参数 start ---- */
      query: {
        current: 1,
        pageSize: 20
      },
      searchOptions: [
        { key: 'orderNo', type: 'text', label: '订单编号' },
        { key: 'desc', type: 'text', label: '描述' }
      ],
      columns: [
        {
          title: '订单编号',
          key: 'orderNo',
          scopedSlots: { customRender: 'orderNo' }
        },
        {
          title: '平台收入',
          key: 'platformIncome',
          scopedSlots: { customRender: 'platformIncome' }
        },
        { title: '接单员收入', key: 'takerIncome', scopedSlots: { customRender: 'takerIncome' } },
        { title: '描述', key: 'desc', dataIndex: 'desc' },
        { title: '时间', key: 'createTime', scopedSlots: { customRender: 'createTime' } }
      ],
      rowKey: 'id',
      api: 'schoolOrderCapitalTrendList'
    };
  }
});
</script>
