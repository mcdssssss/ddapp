import api from '~/plugins/api';
interface Subscribe {
  categoryId: string;
  tid: number;
  title: string;
  type: number;
}
interface State {
  mySubscribes: Subscribe[];
}

export default {
  namespaced: true,
  state: {
    mySubscribes: []
  } as State,
  mutations: {
    setMySubscribes(state: State, val: Subscribe[]) {
      state.mySubscribes = val;
    }
  },
  actions: {
    async fetchMySubscribe({ commit }: { commit: Function }) {
      const res = (await api.wxSubscribeTemplates()) as any;
      if (res.code === 200) {
        commit('setMySubscribes', res.data);
      }
    }
  }
};
