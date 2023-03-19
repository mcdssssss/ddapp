<script lang="ts">
import Vue from 'vue';
import dayjs from 'dayjs';
import { imageCenterCrop } from '@/plugins/oss';
export default Vue.extend({
  layout: 'global',
  data() {
    return {
      query: {
        current: 1,
        pageSize: 20
      } as any,
      tabelData: [],
      count: 0,
      api: '',
      selectedRowKeys: [] as string[],
      loading: false
    };
  },
  mounted() {
    const data = this.$route.query;
    this.getTableData(data);
  },
  methods: {
    dayjs,
    imageCenterCrop,
    // 搜索
    searchChange(data: any) {
      this.getTableData(data);
    },
    // 表格选中
    onSelectChange(value: string[]) {
      this.selectedRowKeys = value;
    },
    // 页码改变
    pageChange() {
      this.getTableData();
    },
    // 获取列表数据
    async getTableData(queryData?: any) {
      let params = JSON.parse(JSON.stringify(this.query)) as any;
      if (queryData) {
        params = Object.assign(params, queryData);
      }
      this.loading = true;
      const result = await (this as any).$api[this.api](params);
      this.loading = false;
      if (result.code === 200) {
        this.tabelData = result.data.data;
        this.count = result.data.count;
      }
    }
  }
});
</script>
