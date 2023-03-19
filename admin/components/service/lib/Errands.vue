<template>
  <div>
    <a-form-model-item label="起步价(元)">
      <a-input-number
        v-model="startPrice"
        style="width: 100%"
        placeholder="起步价"
        @change="commonChange"
      ></a-input-number>
    </a-form-model-item>

    <a-form-model-item label="跑腿项">
      <a-button size="large" @click="visible = true">添加跑腿项</a-button>
      <draggable
        v-model="errands"
        class="mt-12"
        :animation="200"
        draggable=".move-item"
        @change="dragChange"
      >
        <div
          v-for="(item, index) in errands"
          :key="item.id"
          class="move-item flex flex-between item-center"
        >
          <div>
            <div>
              {{ item.templateName }}({{ item.showName }})
              <a-button
                type="link"
                @click="
                  errands.splice(index, 1);
                  commonChange();
                "
              >
                <i class="iconfont icon-delete"></i>
              </a-button>
            </div>
            <div>
              <a-tag v-for="(item2, index2) in item.tags" :key="'t' + index2">{{ item2 }}</a-tag>
            </div>
          </div>
          <div class="iconfont icon-menu fo-9 pointer"></div>
        </div>
      </draggable>
    </a-form-model-item>

    <errands-modal v-model="visible" @choose="errandsChoose" />
  </div>
</template>
<script lang="ts">
import ErrandsModal from '../components/ErrandsModal.vue';
import ServiceMixin from '@/plugins/mixins/service-mixin.vue';
export default ServiceMixin.extend({
  components: {
    ErrandsModal
  },
  // mixins: [ServiceMixin],
  data() {
    return {
      startPrice: 0,
      errands: [] as any[]
    };
  },
  methods: {
    async setFormData(data: any) {
      this.startPrice = data.startPrice;
      const res = await (this as any).$api.errandsIds({ ids: data.errands.toString() });
      if (res.code === 200) {
        this.errands = res.data;
      }
    },
    getFormData() {
      const arr = [] as number[];
      for (const item of this.errands) {
        arr.push(item.id);
      }

      return {
        errands: arr,
        startPrice: this.startPrice
      };
    },
    errandsChoose(errands: any) {
      let isExist = false;
      for (const item of this.errands) {
        if (item.id === errands.id) {
          isExist = true;
          break;
        }
      }
      if (!isExist) {
        this.errands.push(errands);
        this.visible = false;
      } else {
        (this as any).$message.error('不能重复添加');
      }
      this.commonChange();
    }
  }
});
</script>
