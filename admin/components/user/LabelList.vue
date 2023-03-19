<template>
  <div class="home-container">
    <div v-if="!isSub" class="home-page-title">{{ head }}</div>
    <a-page-header v-else :title="title" @back="() => $router.go(-1)"> </a-page-header>
    <Search class="mt-20" :options="searchOptions" @change="searchChange" />
    <div class="flex flex-between item-center">
      <a-button-group>
        <a-button type="primary" size="large" @click="$router.push(addLink)">+ 新增标签 </a-button>
      </a-button-group>
      <a-button-group>
        <a-button size="large" :loading="loading" @click="getTableData"> 刷新 </a-button>
      </a-button-group>
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
      <template slot="is_show" slot-scope="text">
        <a-tag v-if="text.is_show" color="green"> 显示 </a-tag>
        <a-tag v-else color="red"> 关闭 </a-tag>
      </template>
      <template slot="create_time" slot-scope="text">
        <div class="fo-12">创建:{{ dayjs(text.create_time).format('YYYY/MM/DD HH:mm') }}</div>
        <div class="fo-12">更新:{{ dayjs(text.update_time).format('YYYY/MM/DD HH:mm') }}</div>
      </template>
      <template slot="updated_by" slot-scope="text">
        <user-link :no="text.updated_by" />
      </template>
      <template slot="sub" slot-scope="text">
        <router-link :to="`/label/${text.label_no}?title=${text.label_text}`">编辑子级</router-link>
      </template>
      <template slot="action" slot-scope="text">
        <Action
          :options="[
            { label: '修改', key: 'update' },
            { label: '显示', disabled: text.is_show === 1, key: 'is_show', value: 1 },
            { label: '关闭', disabled: text.is_show === 0, key: 'is_show', value: 0 }
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
  props: {
    type: {
      type: String,
      default: ''
    },
    head: {
      type: String,
      default: '列表'
    }
  },
  data() {
    return {
      /* ---- 必要参数 start ---- */
      query: {
        current: 1,
        pageSize: 20,
        label_type: undefined,
        belong_to: undefined
      },
      searchOptions: [
        { key: 'label_text', type: 'text', label: '标签名称' },
        {
          key: 'is_show',
          type: 'select',
          label: '状态',
          options: [
            { label: '状态：全部', value: '' },
            { label: '状态：显示', value: 1 },
            { label: '状态：关闭', value: 0 }
          ],
          optionsValue: ''
        }
      ],
      columns: [
        { title: '序号', key: 'sort', dataIndex: 'sort' },
        {
          title: '信息',
          key: 'label_text',
          dataIndex: 'label_text'
        },
        { title: '状态', key: 'is_show', scopedSlots: { customRender: 'is_show' } },
        { title: '时间', key: 'create_time', scopedSlots: { customRender: 'create_time' } },
        { title: '操作者', key: 'updated_by', scopedSlots: { customRender: 'updated_by' } },
        { title: '子级', key: 'sub', scopedSlots: { customRender: 'sub' } },
        { title: '操作', key: 'id', scopedSlots: { customRender: 'action' } }
      ],
      rowKey: 'label_no',
      api: 'labelList'
      /* ---- 必要参数 end ---- */
    };
  },
  computed: {
    isSub(): boolean {
      return !!this.$route.params.id;
    },
    title(): string {
      return this.$route.query.title as string;
    },
    addLink(): string {
      return this.isSub
        ? `/label/edit/add?belong_to=${this.$route.params.id}&title=${this.title}`
        : '/label/edit/add?label_type=' + this.type;
    }
  },
  mounted() {
    if (this.type) {
      this.query.label_type = this.type;
    }
    if (this.isSub) {
      this.query.belong_to = this.$route.params.id;
    }
    this.getTableData();
  },
  methods: {
    // 操作点击
    actionClick(obj: { key: string; value: any }, text: any) {
      switch (obj.key) {
        case 'is_show':
          this.updateShow(text.label_no, obj.value);
          break;
        case 'update':
          this.$router.push({ path: '/label/edit/update', query: text });
          break;
      }
    },
    // 修改状态
    async updateShow(label_no: string, value: any) {
      const res = await (this as any).$api.labelUpdateShow({
        label_no,
        is_show: value
      });
      if (res.code === 200) {
        (this as any).$message.success(res.msg);
        this.getTableData();
      }
    }
  }
});
</script>
