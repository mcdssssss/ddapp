<template>
  <div class="express">
    <a-form-model-item label="终点占位符">
      <a-input
        v-model="endAddressPlaceholder"
        placeholder="输入终点占位符"
        @input="commonChange"
      ></a-input>
    </a-form-model-item>
    <a-form-model-item label="快递件选项">
      <a-button class="mt-20" size="large" @click="addClear()">+ 添加项目</a-button>
      <draggable
        v-model="express"
        class="mt-12"
        :animation="200"
        draggable=".move-item"
        @change="dragChange"
      >
        <div
          v-for="(item, index) in express"
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
    <ExpressEditModal ref="clearEdit" v-model="visible" :type="editType" @ok="handleChange" />
  </div>
</template>
<script lang="ts">
import ExpressEditModal from '@/components/service/components/ExpressEditModel.vue';
import ServiceMixin from '@/plugins/mixins/service-mixin.vue';
export default ServiceMixin.extend({
  components: {
    ExpressEditModal
  },
  data() {
    return {
      express: [] as any,
      endAddressPlaceholder: '',
      visible: false,
      editType: 'add',
      updateCurrent: 0
    };
  },
  methods: {
    del(index: number) {
      this.express.splice(index, 1);
      this.commonChange();
    },
    addClear() {
      this.editType = 'add';
      this.visible = true;
      (this.$refs.clearEdit as any).formData = {
        name: '',
        desc: '',
        price: 0
      };
    },
    updateClear(index: number) {
      this.updateCurrent = index;
      this.editType = 'update';
      this.visible = true;
      const item = this.express[index];
      (this.$refs.clearEdit as any).formData = {
        name: item.name,
        desc: item.desc,
        price: item.price
      };
    },
    handleChange(e: any) {
      this.visible = false;
      if (this.editType === 'add') {
        this.express.push(JSON.parse(JSON.stringify(e)));
      } else {
        this.express[this.updateCurrent] = JSON.parse(JSON.stringify(e));
      }
      this.commonChange();
    },
    setFormData(data: any) {
      this.endAddressPlaceholder = data.endAddressPlaceholder;
      this.express = JSON.parse(JSON.stringify(data.express));
    },
    getFormData() {
      return {
        express: JSON.parse(JSON.stringify(this.express)),
        endAddressPlaceholder: this.endAddressPlaceholder
      };
    }
  }
});
</script>
