<template>
  <div class="home-container">
    <div class="home-page-title">提现列表</div>
    <Search class="mt-20" :options="searchOptions" @change="searchChange" />
    <div class="flex flex-between item-center">
      <div class="flex flex-start item-cencer">
        <!-- <a-button size="large" @click="cashVisible = true">支付宝提现批量处理</a-button> -->
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
      <template slot="cashBy" slot-scope="text">
        <div v-if="text.cashBy === 'user'">用户</div>
        <div v-else-if="text.cashBy === 'taker'">接单员</div>
      </template>

      <template slot="cashByNo" slot-scope="text">
        <user-link v-if="text.cashBy === 'user'" :no="text.cashByNo"></user-link>
        <rider-link v-else-if="text.cashBy === 'rider'" :no="text.cashByNo"></rider-link>
        <taker-link
          v-else-if="text.cashBy === 'taker'"
          :type="schoolType"
          :no="text.cashByNo"
        ></taker-link>
        <agent-link v-else :no="text.cashByNo"></agent-link>
      </template>

      <template slot="amount" slot-scope="text">
        <div>{{ text.amount }}元</div>
      </template>

      <template slot="account" slot-scope="text">
        <div>{{ text.bankName }}</div>
        <div>{{ text.cardNo }}-{{ text.realname }}</div>
      </template>

      <template slot="status" slot-scope="text">
        <a-tag v-if="text.status === 1" color="green"> 提现成功 </a-tag>
        <a-tag v-else-if="text.status === 0" color="orange"> 待提现 </a-tag>
        <a-tag v-else color="red"> 提现失败 </a-tag>
        <div v-if="text.status === -1" class="fo-9 fo-12">{{ text.reason }}</div>
      </template>
      <template slot="createTime" slot-scope="text">
        <div class="fo-12">创建:{{ dayjs(text.createTime).format('YYYY/MM/DD HH:mm') }}</div>
        <div class="fo-12">更新:{{ dayjs(text.updateTime).format('YYYY/MM/DD HH:mm') }}</div>
      </template>
      <template slot="action" slot-scope="text">
        <Action
          :options="[
            { label: '提现成功', disabled: text.status === 1, key: 'success' },
            { label: '提现失败', disabled: text.status === -1, key: 'fail' }
          ]"
          @click-item="actionClick($event, text)"
        />
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
    <CashRefuse v-model="updateVisible" :no="tempNo" @success="getTableData()" />
    <!-- <MultiCashModel v-model="cashVisible" @refresh="getTableData()" /> -->
  </div>
</template>
<script lang="ts">
import TableDataMixins from '@/plugins/mixins/table-data-mixin.vue';
import RiderLink from '~/components/base/UserLink/RiderLink.vue';
import CashRefuse from '@/components/rider/RefuseCash.vue';
// import MultiCashModel from '@/components/rider/MultiCashModel.vue';
export default TableDataMixins.extend({
  components: { RiderLink, CashRefuse },
  data() {
    return {
      /* ---- 必要参数 start ---- */
      query: {
        current: 1,
        pageSize: 20
      },
      searchOptions: [
        { key: 'bankName', type: 'text', label: '开户行' },
        { key: 'cardNo', type: 'text', label: '银行卡号' },
        { key: 'realname', type: 'text', label: '真实姓名' },
        { key: 'cashNo', type: 'text', label: '提现编号' },
        {
          key: 'status',
          type: 'select',
          label: '状态',
          options: [
            { label: '状态：全部', value: '' },
            { label: '状态：提现成功', value: 1 },
            { label: '状态：待提现', value: 0 },
            { label: '状态：提现失败', value: -1 }
          ],
          optionsValue: ''
        }
      ],
      columns: [
        {
          title: '编号',
          key: 'cashNo',
          dataIndex: 'cashNo'
        },
        { title: '提现用户', key: 'cashBy', scopedSlots: { customRender: 'cashBy' } },
        { title: '用户', key: 'cashByNo', scopedSlots: { customRender: 'cashByNo' } },
        {
          title: '提现金额',
          key: 'amount',
          scopedSlots: { customRender: 'amount' }
        },
        {
          title: '提现账户',
          key: 'account',
          scopedSlots: { customRender: 'account' }
        },
        { title: '状态', key: 'status', scopedSlots: { customRender: 'status' } },
        { title: '时间', key: 'createTime', scopedSlots: { customRender: 'createTime' } },
        { title: '操作', key: 'id', scopedSlots: { customRender: 'action' } }
      ],
      rowKey: 'cashNo',
      api: 'cashList',

      tempNo: '',
      updateVisible: false,
      cashVisible: false
    };
  },

  computed: {
    schoolType() {
      return this.$store.state.version;
    }
  },

  methods: {
    // 操作点击
    actionClick(obj: { key: string; value: any }, text: any) {
      switch (obj.key) {
        case 'success':
          this.updateSuccess(text.cashNo);
          break;
        case 'fail':
          this.updateFail(text.cashNo);
          break;
      }
    },
    // 提现成功
    updateSuccess(cashNo: string) {
      (this as any).$confirm({
        title: '提示',
        content: '请确保提现已到账',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          const result = await (this as any).$api.cashSuccess({ cashNo });
          if (result.code === 200) {
            (this as any).$message.success(result.msg);
            this.getTableData();
          }
        }
      });
    },
    // 修改状态
    updateFail(cashNo: string) {
      this.tempNo = cashNo;
      this.updateVisible = true;
    }
  }
});
</script>
