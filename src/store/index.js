import Vue from 'vue'
import Vuex from 'vuex';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: undefined,
    uuid: undefined,
    connection: new WebSocket('ws://wiki-wars.fr:8000/ws/')
  },
  getters: {
    auth_full_header: state => ({"Authorization": state.token}),
    is_logged: state => state.uuid !== undefined
  },
  actions: {
    try_login: async (state) => {
      if(state.token) {
        const requestOptions = {
          method: "POST",
          headers: this.auth_full_header(state)
        }
        const response = await fetch(`${this.$base_url}/check_token`, requestOptions)
        if(response.status === 200){
          state.uuid = response.json().uuid
          state.connection.send(JSON.stringify({event:'user_assignation', token: state.token}))
        }
      }
    }
  },
  mutations: {
    setToken (state, token) {
      state.token = token
    },
    setUUID (state, uuid) {
      state.uuid = uuid
    }
  }
})