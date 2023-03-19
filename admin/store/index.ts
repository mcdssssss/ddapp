import Vuex from 'vuex';
import Vue from 'vue';
import profile from './modules/profile';
import subscribe from './modules/subscribe';
import file from './modules/file';
import system from './modules/system';
import { VersionType } from './version';
Vue.use(Vuex);
interface IndexState {
  tempData: any;
  beginDate: string;
  endDate: string;
  version: 'city' | 'school' | 'community' | '';
  versionType: string;
  isSass: Boolean;
}
export default () => {
  // eslint-disable-next-line import/no-named-as-default-member
  return new Vuex.Store({
    state: {
      tempData: null as any,
      beginDate: '',
      endDate: '',
      version: '',
      versionType: VersionType
    } as IndexState,
    mutations: {
      setVersionType(state: IndexState, val: string) {
        state.versionType = val;
      },
      setTempData(state: IndexState, val: any) {
        state.tempData = val;
      },
      setBeginDate(state: IndexState, val) {
        state.beginDate = val;
      },
      setEndDate(state: IndexState, val) {
        state.endDate = val;
      },
      setVersion(state: IndexState, val) {
        state.version = val;
        localStorage.setItem('versionName', val);
      }
    },
    actions: {},
    modules: {
      profile,
      subscribe,
      file,
      system
    }
  });
};
