<template>
  <a-modal
    :visible="visible"
    title="添加服务"
    :destroy-on-close="true"
    ok-text="确定"
    cancel-text="取消"
    :width="600"
    @ok="handleOk"
    @cancel="$emit('change', false)"
  >
    <a-form v-model="formData">
      <a-form-item label="服务类型">
        <a-select v-model="formData.type" placeholder="请选择服务类型" style="width: 100%">
          <a-select-option
            v-for="(item, index) in serviceItems"
            :key="index"
            :value="item.value"
            :disabled="item.disabled"
            >{{ item.label }}</a-select-option
          >
          <a-select-option key="link" value="link">内部链接</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="展示名称">
        <a-input v-model="formData.label" placeholder="请输入展示名称" />
      </a-form-item>
      <a-form-item label="展示图标">
        <UploadImage v-model="formData.image" :height="100" :width="100"></UploadImage>
        <!-- <upload v-model="formData.image" :width="100" :height="100" />
        <a-input v-model="formData.image" placeholder="图片路径"></a-input> -->
      </a-form-item>
      <a-form-item v-if="formData.type && formData.type !== 'link'" label="平台抽点">
        <a-input-number v-model="formData.extractForPlatform" style="width: 100%"></a-input-number>
        <div class="fo-12 fo-9">请输入小于1的数值</div>
      </a-form-item>
      <a-form-item v-if="formData.type && formData.type !== 'link'" label="是否将订单发送至大厅">
        <a-radio-group v-model="formData.intoHall">
          <a-radio :value="true"> 是 </a-radio>
          <a-radio :value="false"> 否 </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item v-if="formData.type === 'link'" label="链接">
        <a-input v-model="formData.link" placeholder="请输入一个链接 必须以“/”开头"></a-input>
      </a-form-item>

      <a-form-model-item v-if="formData.type === 'errands'" label="重量规则">
        <a-row v-for="(item, index) in formData.weightRules" :key="index" :gutter="16">
          <a-col :span="10">
            <div>范围(kg):</div>
            <a-input-number
              v-model="item.gt"
              :disabled="index > 0"
              :min="index > 0 ? formData.weightRules[index - 1].lte : 0"
            />
            ~
            <a-input-number v-model="item.lte" :min="item.gt + 1" />
          </a-col>
          <a-col :span="6">
            <div>重量单位(kg):</div>
            <a-input-number v-model="item.unit" style="width: 100%" />
          </a-col>
          <a-col :span="6">
            <div>价格(元):</div>
            <a-input-number v-model="item.price" style="width: 100%" />
          </a-col>
          <a-col :span="2">
            <a-button
              style="margin-top: 44px"
              type="danger"
              shape="circle"
              icon="delete"
              @click="delRule('weightRules', index)"
            />
          </a-col>
          <a-col :span="24">
            <span class="fo-9"
              >重量在({{ item.gt }}kg~{{ item.lte }}kg)范围内，<span v-if="item.unit > 0"
                >每{{ item.unit }}kg</span
              >加价{{ item.price }}元</span
            >
          </a-col>
        </a-row>

        <a-button class="mt-20" size="large" @click="addRule('weightRules')"
          >+ 添加重量规则</a-button
        >
      </a-form-model-item>

      <a-form-model-item
        v-if="['software', 'errands', 'play'].includes(formData.type)"
        label="快捷标签选项"
      >
        <a-select v-model="formData.tags" mode="tags" style="width: 100%" :token-separators="[',']">
        </a-select>
        <div class="fo-12 fo-9">提示：输入一项按回车</div>
      </a-form-model-item>

      <a-form-model-item v-if="formData.type === 'express'" label="快递件选项">
        <a-button class="mt-20" size="large" @click="addClear()">+ 添加项目</a-button>
        <draggable v-model="formData.express" class="mt-12" :animation="200" draggable=".move-item">
          <div
            v-for="(item, index) in formData.express"
            :key="item.id"
            class="move-item flex flex-between item-center"
          >
            <div>
              <div>{{ item.name }} ({{ item.price }}元)</div>
              <div class="fo-9 fo-12">
                {{ item.desc }}
              </div>
              <div>
                <a-button type="link" @click="updateClear(index)">
                  <i class="iconfont icon-edit"></i>
                </a-button>
                <a-button type="link" @click="del(index)">
                  <i class="iconfont icon-delete"></i>
                </a-button>
              </div>
            </div>
            <div class="iconfont icon-menu fo-9 pointer"></div>
          </div>
        </draggable>
      </a-form-model-item>
      <ExpressEditModal
        ref="clearEdit"
        v-model="expressVisible"
        :type="editType"
        @ok="handleChange"
      />
    </a-form>
  </a-modal>
</template>
<script lang="ts">
import Vue from 'vue';
import draggable from 'vuedraggable';
import ExpressEditModal from '@/components/service/components/ExpressEditModel.vue';
import { serviceItems } from '@/plugins/config';
interface Rule {
  gt: number;
  lte: number;
  unit?: number;
  price: number;
}
export default Vue.extend({
  components: {
    draggable,
    ExpressEditModal
  },
  model: {
    prop: 'visible',
    event: 'change'
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      editType: 'add',
      expressVisible: false,
      updateCurrent: 0,
      formData: {
        type: '',
        label: '',
        image: '',
        serviceTempNo: '',
        extractForPlatform: 0, // 平台抽点
        link: '',
        intoHall: true,
        weightRules: [] as Rule[],
        tags: [],
        express: [] as any[]
      }
    };
  },
  computed: {
    serviceItems(): any[] {
      const arr = JSON.parse(JSON.stringify(serviceItems));

      return arr;
    }
  },
  methods: {
    handleChange(e: any) {
      this.expressVisible = false;
      if (this.editType === 'add') {
        this.formData.express.push(JSON.parse(JSON.stringify(e)));
      } else {
        this.formData.express[this.updateCurrent] = JSON.parse(JSON.stringify(e));
      }
    },
    del(index: number) {
      this.formData.express.splice(index, 1);
    },
    addClear() {
      this.editType = 'add';
      this.expressVisible = true;
      (this.$refs.clearEdit as any).formData = {
        name: '',
        desc: '',
        price: 0
      };
    },
    updateClear(index: number) {
      this.updateCurrent = index;
      this.editType = 'update';
      this.expressVisible = true;
      const item = this.formData.express[index];
      (this.$refs.clearEdit as any).formData = {
        name: item.name,
        desc: item.desc,
        price: item.price
      };
    },
    addRule() {
      const arr = this.formData.weightRules;
      if (arr.length === 0) {
        arr.push({ gt: 1, lte: 3, unit: 1, price: 1 });
      } else if (arr.length > 0) {
        const pre = arr[this.formData.weightRules.length - 1];
        arr.push({ gt: pre.lte, lte: pre.lte + 3, unit: 1, price: pre.price + 1 });
      }
      this.formData.weightRules = arr;
    },
    handleOk() {
      this.$emit('ok', this.formData);
    }
  }
});
</script>
<style lang="less" scoped>
.move-item {
  width: 100%;
  min-height: 60px;
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.08);
  margin-top: 10px;
}
</style>