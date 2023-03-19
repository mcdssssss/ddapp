import { getSchoolInfo } from "@/utils/api";
export interface ServiceData {
  type: string;
  label: string;
  image: string;
  serviceTempNo?: string;
  extractForPlatform?: number; // 平台抽点
  extractForAgent?: number; // 代理抽点
  link?: string;
  nanoid: string; // nanoid
  data?: any;
}
export interface ServiceObject {
  iconInWhere?: string;
  sortStyle: string; // 排序方式
  services: ServiceData[];
}

interface State {
  schoolNo: string;
  schoolName: string;
  schoolLogo: string;
  sortStyle: string;
  iconInWhere: string;
  services: ServiceData[];
}
export default {
  namespace: true,
  state: {
    schoolNo: "",
    schoolName: "",
    schoolLogo: "",
    sortStyle: "sort-4",
    iconInWhere: "fixBtn",
    services: [],
  } as State,
  mutations: {
    setSchoolNo(state: State, value: string) {
      state.schoolNo = value;
    },
    setInfo(
      state: State,
      data: {
        schoolName: string;
        schoolLogo: string;
        serviceData: ServiceObject | null;
      }
    ) {
      state.schoolName = data.schoolName;
      state.schoolLogo = data.schoolLogo;
      if (data.serviceData) {
        state.iconInWhere = data.serviceData.iconInWhere || "fixBtn";
        state.sortStyle = data.serviceData.sortStyle;
        state.services = data.serviceData.services;
      }
    },
  },
  actions: {
    async fetchSchoolInfo({ commit }: { commit: Function }, val: string) {
      const res = await getSchoolInfo();
      if (res.code === 200) {
        commit("setInfo", res.data);
      }
    },
  },
};
