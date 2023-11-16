const state = {
  eranRedPoint: true,
  chatRedPoint: false,
}

const actions = {
  async setTitle({ commit }, title) {
    commit('setTitle', title)
  },
  async updateChatRedPoint({ commit }, flag) {
    commit('updateChatRedPoint', flag)
  }
}

const mutations = {
  setTitle(state, title) {
    state.title = title
  },
  updateEranRedPoint(state, payload) {
    state.eranRedPoint = payload
  },
  updateChatRedPoint(state, payload) {
    state.chatRedPoint = payload
  },
}

export default {
  state,
  actions,
  mutations
}
