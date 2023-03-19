<template>
  <div class="home-container">
    <a-page-header :title="title + '学校信息'" @back="() => $router.go(-1)"> </a-page-header>
    <div class="edit-content">
      <a-form-model ref="ruleForm" :model="formData" :rules="rules">
        <a-form-model-item :label="'学校名称'">
          <a-input v-model="formData.schoolName" placeholder="请输入名称" />
        </a-form-model-item>

        <a-form-model-item label="LOGO">
          <UploadImage v-model="formData.schoolLogo" :height="100" :width="100"></UploadImage>
        </a-form-model-item>
        <a-form-model-item label="省市" prop="province">
          <a-cascader
            :value="[formData.province, formData.city]"
            :options="citys"
            :field-names="{ label: 'name', value: 'name', children: 'children' }"
            placeholder="请选择一个城市"
            @change="chooseCityChange"
          />
        </a-form-model-item>

        <a-form-model-item label="所在地点" prop="area">
          <a-select
            v-model="keySearch"
            label-in-value
            placeholder="输入地点名称搜索"
            show-search
            style="width: 100%"
            :filter-option="false"
            :not-found-content="fetchingAddress ? undefined : null"
            @search="fetchAddress"
            @change="chooseAddress"
          >
            <template v-if="fetchingAddress" #notFoundContent>
              <a-spin size="small" />
            </template>
            <a-select-option v-for="(d, index) in address" :key="d.id" :value="index">
              {{ d.title }}
            </a-select-option>
          </a-select>
          <div class="fo-9">输入地点名称搜索并选择</div>
        </a-form-model-item>

        <a-form-model-item label="运营状态">
          <a-radio-group v-model="formData.status">
            <a-radio :value="1"> 运营 </a-radio>
            <a-radio :value="0"> 关闭 </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="primary" size="large" :loading="loading" @click="submit"
            >提交保存</a-button
          >
        </a-form-model-item>
      </a-form-model>
    </div>
  </div>
</template>
<script lang="ts">
import EditMixin from '@/plugins/mixins/edit-mixin.vue';
import { pacData } from '@/plugins/city';
import Upload from '~/components/base/Upload/Upload.vue';
export default EditMixin.extend({
  components: { Upload },
  layout: 'global',
  data() {
    return {
      formData: {
        schoolName: '',
        province: '',
        city: '',
        area: '',
        schoolLogo: '',
        status: 0,
        addressDetail: '',
        latitude: 0,
        longitude: 0
      },
      keySearch: '',
      rules: {
        schoolName: [{ required: true, message: '名称必填', trigger: 'blur' }],
        schoolLogo: [{ required: true, message: 'LOGO必填', trigger: 'blur' }],
        province: [{ required: true, message: '省市必选', trigger: 'blur' }],
        area: [{ required: true, message: '地址必选', trigger: 'blur' }]
      },
      citys: pacData,
      fetching: false,
      fetchingAddress: false,
      address: []
    };
  },
  computed: {
    method(): string {
      return 'schoolUpdate';
    }
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    async getInfo() {
      const res = await (this as any).$api.schoolInfo();
      if (res.code === 200 && res.data.schoolName) {
        this.formData.schoolName = res.data.schoolName as string;
        this.formData.province = res.data.province as string;
        this.formData.city = res.data.city as string;
        this.formData.area = res.data.area as string;
        this.formData.schoolLogo = res.data.schoolLogo as string;
        this.formData.addressDetail = res.data.addressDetail as string;
        this.formData.latitude = parseFloat(res.data.latitude as string);
        this.formData.longitude = parseFloat(res.data.longitude as string);
        this.formData.status = parseInt(res.data.status as string);
      }
    },

    chooseCityChange(e: string[]) {
      this.formData.province = e[0];
      this.formData.city = e[1];
    },
    chooseAddress(e: { key: number }) {
      const data = this.address[e.key] as any;
      this.formData.area = data.ad_info.district;
      this.formData.addressDetail = data.address;
      this.formData.latitude = data.location.lat;
      this.formData.longitude = data.location.lng;
    },

    async fetchAddress(value: string) {
      this.fetchingAddress = true;
      const result = await (this as any).$api.localtionSearch({
        keyword: value,
        cityName: this.formData.city
      });
      this.fetchingAddress = false;
      if (result.code === 200) {
        this.address = result.data;
      }
    }
  }
});
</script>
