import api from '~/plugins/api';
interface State {
  systemName: string;
  agentSystemName: string;
  companyName: string;
  recordNo: string;
  logo: string;

  // 是否有插件
  hasPlugin: boolean;
  activity: boolean;
  bulletinBoard: boolean;
  shop: boolean;
}

export default {
  namespaced: true,
  state: {
    systemName: '',
    agentSystemName: '',
    companyName: '',
    recordNo: '',
    logo: ''
  } as State,
  mutations: {
    setSystemInfo(state: State, data: any) {
      state.systemName = data.systemName;
      state.agentSystemName = data.agentSystemName;
      state.companyName = data.companyName;
      state.recordNo = data.recordNo;
      state.logo = data.logo;
    }
  },
  actions: {
    async fetchSystemInfo({ commit }: { commit: Function }) {
      const res = (await api.adminSystemInfo()) as any;
      if (res.code === 200 && res.data) {
        commit('setSystemInfo', res.data);
        if (res.data.systemName) {
          document.title = res.data.systemName;
        }
      }
    }
  }
};
