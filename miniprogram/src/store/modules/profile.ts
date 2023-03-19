interface State {
  nickName: string;
  avatarUrl: string;
  countryCode: string;
  mobileNumber: string;
  gender: number;
  userNo: string;
}
export default {
  namespace: true,
  state: {
    nickName: "",
    avatarUrl: "",
    countryCode: "",
    mobileNumber: "",
    gender: 0,
    userNo: "",
  } as State,
  mutations: {
    setProfile(state: State, data: any) {
      state.userNo = data.userNo;
      state.nickName = data.nickName;
      state.avatarUrl = data.avatarUrl;
      state.countryCode = data.countryCode;
      state.mobileNumber = data.mobileNumber;
      state.gender = data.gender;
    },
  },
  actions: {},
  getters: {},
};
