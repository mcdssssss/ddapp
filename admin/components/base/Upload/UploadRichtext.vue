<template>
  <div>
    <div class="richtext-item" @click="visible = true">
      <div class="pic-image flex flex-center item-center">
        <img v-if="info.richImage" :src="imageCenterCrop(info.richImage, 200, 160, 90)" />
        <i v-else class="iconfont icon-pic-add"></i>
      </div>
      <div class="richtext-title ell-2 bold">
        {{ info.richTitle || '' }}
      </div>
    </div>
    <a-modal
      :visible="visible"
      :destroy-on-close="true"
      :footer="null"
      :width="1300"
      @cancel="visible = false"
    >
      <Richtext
        ref="pic"
        type="component"
        :limit="1"
        @cancel="visible = false"
        @choose="choosePic"
      />
    </a-modal>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Richtext from '@/pages/material/richtext/index.vue';
import { imageCenterCrop } from '@/plugins/oss';
export default Vue.extend({
  model: {
    prop: 'value',
    event: 'change'
  },
  components: {
    Richtext
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      visible: false,
      info: {},
      isFirst: false
    };
  },
  mounted() {
    if (this.value) {
      this.getInfo();
    }
  },
  watch: {
    visible(val: boolean) {
      if (!val) {
        (this.$refs.pic as any).checkedAllChange({ target: { checked: false } });
      }
    },
    value(e) {
      if (e && !this.isFirst) {
        this.getInfo();
        this.isFirst = true;
      }
    }
  },
  methods: {
    imageCenterCrop,
    async getInfo() {
      const res = await (this as any).$api.richtextInfo({ richNo: this.value });
      if (res.code === 200) {
        this.info = res.data;
      }
    },
    choosePic(e: any[]) {
      this.$emit('change', e[0].richNo);
      this.info = e[0];
      this.visible = false;
    }
  }
});
</script>
<style lang="less" scoped>
.richtext-item {
  width: 200px;
  margin-right: 12px;
  margin-bottom: 12px;
  border-radius: 4px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid #ffffff;
  transition: 0.2s linear border;
  cursor: pointer;
  .pic-image {
    width: 200px;
    height: 160px;
    border-radius: 4px 4px 0 0;
    overflow: hidden;
    position: relative;
  }
  .richtext-title {
    padding: 10px;
    line-height: 16px;
    font-size: 12px;
    height: 52px;
  }
  &:hover {
    border: 1px solid #955ce6;
    .iconfont {
      color: #955ce6;
    }
  }
  .iconfont {
    color: #999999;
    font-size: 26px;
    transition: color 0.2s linear;
  }
}
</style>
