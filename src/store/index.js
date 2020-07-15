import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

    name : "",
    id : ""

  },
  mutations: {
    setUser(state, user) {
      state.name = user.name
      state.id = user.id
    }
  },
  actions: {
  },
  modules: {
  }
})
