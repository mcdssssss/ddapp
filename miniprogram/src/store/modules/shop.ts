export interface Cart {
  goodsNo: string;
  goodsName: string;
  goodsImage: string;
  spec: string[];
  specPrice: number[];
  totalPrice: number;
  count: number;
  packFee: number;
}

interface State {
  // 展示规格弹窗
  showSpec: boolean;
  tempGoods: any;
  carts: Cart[];
  groupNo: string;
  showCart: boolean;
}

export default {
  namespace: true,
  state: {
    groupNo: "",
    showSpec: false,
    tempGoods: {},
    carts: [],
    showCart: false,
  },
  mutations: {
    setShowCart(state: State, val: boolean) {
      state.showCart = val;
    },
    setGroupNo(state: State, val: string) {
      state.groupNo = val;
    },
    setCarts(state: State, val: Cart[]) {
      state.carts = val;
    },
    addCart(state: State, val: number) {
      state.carts[val].count++;
      if (state.carts.length === 0) {
        state.showCart = false;
      }
    },
    pushCart(state: State, val: Cart) {
      let isHas = false;
      for (const item of state.carts) {
        if (item.goodsNo === val.goodsNo) {
          isHas = true;
          if (item.spec.toString() === val.spec.toString()) {
            item.count++;
            break;
          } else {
            state.carts.push(val);
            break;
          }
        }
      }
      if (!isHas) {
        state.carts.push(val);
      }
    },
    reduceCart(state: State, index: number) {
      const cart = state.carts[index];
      if (cart.count > 1) {
        cart.count--;
      } else {
        state.carts.splice(index, 1);
      }
      if (state.carts.length === 0) {
        state.showCart = false;
      }
    },
    reduceByGoodsNo(state: State, goodsNo: string) {
      for (const i in state.carts) {
        const item = state.carts[i];
        if (item.goodsNo === goodsNo) {
          if (item.count > 1) {
            item.count--;
          } else {
            state.carts.splice(parseInt(i), 1);
          }
          break;
        }
      }
      if (state.carts.length === 0) {
        state.showCart = false;
      }
    },
    setShowSpec(state: State, val: boolean) {
      state.showSpec = val;
    },
    setTempGoods(state: State, val: any[]) {
      state.tempGoods = val;
    },
  },
  actions: {},
};
