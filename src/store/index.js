import { createStore } from 'vuex'

export default createStore({
  state: {
    rol: localStorage.getItem('rol') || '',
    token: localStorage.getItem('token') || '',
    nombre: localStorage.getItem('nombre') || ''
  },
  getters: {
    isLogin(state) {
      return state.token !== ''
    },
    getRol(state) {
      return state.rol
    },
    getNombre(state) {
      return state.nombre
    }
  },
  mutations: {
    clearToken(state) {
      state.token = ''
    },
    setRol(state, rol) {
      state.rol = rol
    },
    setToken(state, token) {
      state.token = token
    },
    setNombre(state, nombre) {
      state.nombre = nombre
    }
  },
  actions: {
    clearToken({ commit }) {
      commit('clearToken')
    },
    setRol({ commit }, rol) {
      commit('setRol', rol)
    },
    setToken({ commit }, token) {
      commit('setToken', token)
    },
    setNombre({ commit }, nombre) {
      commit('setNombre', nombre)
    }
  }
})