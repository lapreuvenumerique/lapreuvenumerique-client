import Vue from 'vue'
import Vuex from 'vuex'
import VueCryptojs from 'vue-cryptojs'

Vue.use(Vuex)
Vue.use(VueCryptojs)

export default new Vuex.Store({
  state: {

    id: "",
    keyEncryptedApiKey: "LaPreuveNumerique"

  },
  mutations: {
    setId(state, id) {
      state.id = id
    },
    setKey(state, key) {
      state.encryptKeyApiKey = key
    }
  },
  actions: {
  },
  modules: {
  }
})
