interface State {
  unreadCoupons: any[];
  showCouponModal: boolean;
}
export default {
  namespace: true,
  state: {
    unreadCoupons: [],
    showCouponModal: false,
  },
  mutations: {
    setUnreadCoupons(state: State, val: any[]) {
      state.unreadCoupons = val;
    },
    setShowCouponModal(state: State, val: boolean) {
      state.showCouponModal = val;
    },
  },
  actions: {},
};
