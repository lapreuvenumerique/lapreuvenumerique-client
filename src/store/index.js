import Vue from 'vue'
import Vuex from 'vuex'
import VueCryptojs from 'vue-cryptojs'

Vue.use(Vuex)
Vue.use(VueCryptojs)

export default new Vuex.Store({
  state: {
    id: "",
    apiKey: "",
    customerUid: ""
  },
  mutations: {
    setId(state, id) {
      state.id = id
    },
    setCredentials(state, keys){
      state.apiKey = keys.apiKey
      state.customerUid = keys.customerUid
    }
  },
  actions: {
  },
  modules: {
  }
})
