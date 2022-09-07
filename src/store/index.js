import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null
  },
  getters: {
    userInfo(state) {
      return state.user?.userInfo
    },
    userRole(state) {
      return state.user?.roles
    },
    user(state) {
      return state.user
    }
  },
  mutations: {
    userCommit(state, user) {
      state.user = user
    }
  },
  actions: {
    setUser(context, user) {
      context.commit("userCommit", user)
    }
  }
})
