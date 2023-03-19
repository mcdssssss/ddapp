import api from '~/plugins/api';

interface State {
  list: any[];

  files: any[];
  query: { current: number; pageSize: number; groupId: number };
  fileCount: number;
  richtexts: any[];
  richCount: number;
  richGroupList: any[];
  richQuery: {
    current: number;
    pageSize: number;
    groupId: number;
    richTitle?: string;
  };

  canIUpload: boolean;
}

export default {
  namespaced: true,
  state: {
    list: [],
    richGroupList: [],
    query: {
      current: 1,
      pageSize: 24,
      groupId: 0
    },
    files: [],
    fileCount: 0,
    richtexts: [],
    richCount: 0,
    richQuery: {
      current: 1,
      pageSize: 20,
      groupId: 0,
      richTitle: ''
    },
    canIUpload: false
  } as State,
  mutations: {
    setCanIUpload(state: State, val: boolean) {
      state.canIUpload = val;
    },
    setList(state: State, val: any[]) {
      state.list = val;
    },
    setRichGroupList(state: State, val: any[]) {
      state.richGroupList = val;
    },
    setFiles(state: State, val: any[]) {
      state.files = val;
    },
    setGroupId(state: State, val: number) {
      state.query.groupId = val;
    },
    setCurrent(state: State, val: number) {
      state.query.current = val;
    },
    setFileCount(state: State, val: number) {
      state.fileCount = val;
    },
    setRichCurrent(state: State, val: number) {
      state.richQuery.current = val;
    },
    setRichGroupId(state: State, val: number) {
      state.richQuery.groupId = val;
    },
    setRichCount(state: State, val: number) {
      state.richCount = val;
    },
    setRichTitle(state: State, val: string) {
      state.richQuery.richTitle = val;
    },
    setRichtexts(state: State, val: any) {
      state.richtexts = val;
    }
  },
  actions: {
    async checkUpload({ commit }: { commit: Function }) {
      const result = (await api.adminAliGet()) as any;
      if (result.code === 200) {
        if (result.data.accessKeyId && result.data.accessKeySecret) {
          commit('setCanIUpload', true);
        } else {
          commit('setCanIUpload', false);
        }
      }
    },
    async fetchFileGroupList(
      { commit }: { commit: Function },
      { groupType }: { groupType: string }
    ) {
      const res = (await api.fileGroupList({ groupType })) as any;
      if (res.code === 200) {
        if (groupType === 'file') {
          commit('setList', res.data);
        } else {
          commit('setRichGroupList', res.data);
        }
      }
    },
    async fetchFileList({ commit, state }: { commit: Function; state: State }) {
      const res = (await api.fileList(state.query)) as any;
      if (res.code === 200) {
        for (const item of res.data.data) {
          (item as any).checked = false;
        }
        commit('setFiles', res.data.data);
        commit('setFileCount', res.data.count);
      }
    },
    async fetchRichtextList({ commit, state }: { commit: Function; state: State }) {
      const res = (await api.richtextList(state.richQuery)) as any;
      if (res.code === 200) {
        for (const item of res.data.data) {
          (item as any).checked = false;
        }
        commit('setRichtexts', res.data.data);
        commit('setRichCount', res.data.count);
      }
    }
  }
};
