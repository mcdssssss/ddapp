import { PublishAddressInterface } from "@/utils/constrants";
interface State {
  startAddress: PublishAddressInterface;
  endAddress: PublishAddressInterface;
  serviceDetails: any;
  serviceNanoid: string;
  serviceType: string;
  addressType: "double" | "start" | "end";
}
export default {
  namespace: true,
  state: {
    startAddress: {},
    endAddress: {},
    serviceDetails: undefined,
    serviceNanoid: "",
    serviceType: "",
    addressType: "double",
  } as State,
  mutations: {
    setPublishData(
      state: State,
      params: {
        startAddress: PublishAddressInterface;
        endAddress: PublishAddressInterface;
        serviceDetails: any;
        serviceNanoid: string;
        serviceType: string;
        addressType: "double" | "start" | "end";
      }
    ) {
      state.startAddress = params.startAddress;
      state.endAddress = params.endAddress;
      state.serviceNanoid = params.serviceNanoid;
      state.serviceDetails = params.serviceDetails;
      state.serviceType = params.serviceType;
      state.addressType = params.addressType;
    },
    clearPublish(state: State) {
      state.startAddress = {};
      state.endAddress = {};
      state.serviceNanoid = "";
      state.serviceDetails = undefined;
      state.serviceType = "";
      state.addressType = "double";
    },
  },
  actions: {},
  getters: {},
};
