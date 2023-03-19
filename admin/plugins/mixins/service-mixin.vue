<script lang="ts">
import Vue from 'vue';
import draggable from 'vuedraggable';
export default Vue.extend({
  components: {
    draggable
  },
  data() {
    return {
      visible: false
    };
  },
  methods: {
    commonChange() {
      this.$emit('change', this.getFormData());
    },
    async setFormData() {},
    getFormData() {
      return {};
    },
    dragChange() {
      this.commonChange();
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
