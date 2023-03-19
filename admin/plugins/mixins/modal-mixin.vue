<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      width: 384
    };
  },
  methods: {
    close() {
      this.$emit('change', false);
    }
  }
});
</script>
