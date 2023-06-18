import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      isLoggedIn: false,
      userType: "",
      userName: "",
    };
  },
  mutations: {
    setLoggedIn(state, isLoggedIn) {
      state.isLoggedIn = isLoggedIn;
    },
    setUserType(state, userType) {
      state.userType = userType;
    },
    setUserName(state, userName) {
      state.userName = userName;
    },
  },
});

export default store;
