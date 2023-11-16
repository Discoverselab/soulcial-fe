const state = {
  eranRedPoint: true,
}

const actions = {
  async setTitle({ commit }, title) {
    commit('setTitle', title)
  }
}

const mutations = {
  setTitle(state, title) {
    state.title = title
  },
  updateEranRedPoint(state, payload) {
    state.eranRedPoint = payload
  },
}

export default {
  state,
  actions,
  mutations
}
