<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  data() {
    return {
      loading: false,
      formData: {},
      rules: {},
      autoBack: true,
      fixdBack: false
    };
  },
  computed: {
    isAdd(): boolean {
      return this.$route.params.type === 'add';
    },
    title(): string {
      return this.isAdd ? '新增' : '修改';
    },
    method(): string {
      return '';
    }
  },
  methods: {
    beforeSubmit() {
      return true;
    },
    submit() {
      const before = this.beforeSubmit();
      if (!before) {
        return;
      }
      (this.$refs as any).ruleForm.validate(async (valid: boolean) => {
        if (valid) {
          this.loading = true;
          const result = await (this as any).$api[this.method](this.formData);
          this.loading = false;
          if (result.code === 200) {
            (this as any).$message.success(result.msg);
            if (this.fixdBack) {
              this.$router.go(-1);
            } else if (this.autoBack) {
              if (!this.isAdd) {
                this.$router.go(-1);
              }
            }
          }
        } else {
          return false;
        }
      });
    }
  }
});
</script>
