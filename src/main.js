// === DEFAULT / CUSTOM STYLE ===
// WARNING! always comment out ONE of the two require() calls below.
// 1. use next line to activate CUSTOM STYLE (./src/themes)
// require(`./themes/app.${__THEME}.styl`)
// 2. or, use next line to activate DEFAULT QUASAR STYLE
require(`quasar/dist/quasar.${__THEME}.css`)
// ==============================

import Vue from 'vue'
import Quasar from 'quasar'
import router from './router'
import Vuex from 'vuex'

// Cordova plugins

class AudioStream {
  constructor (name, options) {
    this.name = name
    this.audio = new Audio()
    this.options = options
  }
  trigger () {
    this.audio.src = this.options['stream']
    this.audio.play()
  }
  stop () {
    this.audio.pause()
  }
}

var npr = new AudioStream('NPR Stream', {stream: 'https://nprdmp-live01-mp3.akacast.akamaistream.net/7/998/364916/v1/npr.akacast.akamaistream.net/nprdmp_live01_mp3'})

Vue.use(Quasar) // Install Quasar Framework
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0,
    procedures: [npr],
    alarmOff: true
  },
  mutations: {
    increment (state) {
      state.count++
    },
    alarmOn (state) {
      state.alarmOff = false
    },
    alarmOff (state) {
      state.alarmOff = false
    }
  }
})

Quasar.start(() => {
  /* eslint-disable no-new */
  new Vue({
    el: '#q-app',
    router,
    store,
    render: h => h(require('./App'))
  })
})

store.commit('increment')
