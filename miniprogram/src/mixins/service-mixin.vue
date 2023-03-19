<script lang="ts">
import Vue from "vue";
import NextBtn from "@/components/service/components/NextBtn.vue";
import { ServiceData } from "@/store/modules/school";
import { PublishAddressInterface } from "@/utils/constrants";

export default Vue.extend({
  components: {
    NextBtn,
  },
  data() {
    return {
      startAddress: {} as PublishAddressInterface,
      endAddress: {} as PublishAddressInterface,
      formData: {},
      nanoid: "",
    };
  },
  computed: {
    services(): ServiceData[] {
      return this.$store.state.school.services;
    },
    currentService(): ServiceData | undefined {
      for (const item of this.services) {
        if (item.nanoid === this.nanoid) {
          return item;
        }
      }
      return undefined;
    },
  },
  onLoad(options: { label?: string; nanoid?: string }) {
    if (options.label) {
      uni.setNavigationBarTitle({
        title: options.label,
      });
    }
    if (options.nanoid) {
      this.nanoid = options.nanoid;
    }
  },
  methods: {
    navToNext(params: any, addressType: string) {
      this.$store.commit("setPublishData", {
        startAddress: this.startAddress,
        endAddress: this.endAddress,
        serviceDetails: params,
        serviceNanoid: this.currentService?.nanoid,
        serviceType: this.currentService?.type,
        addressType,
      });
      uni.navigateTo({
        url: "/pages/publish/publish",
      });
    },
  },
});
</script>
