import { configProtocol, configSubscribe } from "@/utils/api";
import { getProvider } from "@/utils/common";
interface State {
  userGuide: string;
  loginAgreement: string;
  takerGuide: string;
  takerAgreement: string;
  tempIds: {
    orderComplete: string;
    orderCancel: string;
    orderReceive: string;
    verifyResult: string;
  };
}
export default {
  namespace: true,
  state: {
    userGuide: "",
    loginAgreement: "",
    takerGuide: "",
    takerAgreement: "",

    tempIds: {},
  },
  mutations: {
    setProtocol(state: State, val: any) {
      state.loginAgreement = val.loginAgreement;
      state.takerAgreement = val.takerAgreement;
      state.takerGuide = val.takerGuide;
      state.userGuide = val.userGuide;
    },
    setSubscribe(state: State, val: any) {
      state.tempIds = val;
    },
  },
  actions: {
    async initConfigProtocol({
      commit,
      state,
    }: {
      commit: Function;
      state: State;
    }) {
      if (
        !state.userGuide ||
        !state.takerGuide ||
        !state.loginAgreement ||
        !state.takerAgreement
      ) {
        const result = await configProtocol();
        if (result.code === 200 && result.data) {
          commit("setProtocol", result.data);
        }
      }
    },
    async fetchSubscribe({ commit }: { commit: Function; state: State }) {
      const provider = await getProvider();
      const result = await configSubscribe({ provider: provider as string });
      if (result.code === 200 && result.data) {
        commit("setSubscribe", result.data);
      }
    },
  },
};
