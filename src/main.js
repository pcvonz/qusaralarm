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
import axios from 'axios'

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

class Weather {
  constructor (name, options) {
    this.name = name
    this.options = options
    this.axios = axios
  }
  trigger () {
    let getUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${this.options.zip},${this.options.countryCode}`
    console.log(getUrl)
    this.axios.get(`https://api.openweathermap.org/data/2.5/weather?zip=${this.options.zip},${this.options.countryCode}`).then(response => {
      TTS.speak(response.weather.description, function () {
        alert('success')
      }, function (reason) {
        alert(reason)
      })
    }).catch(e => {
      console.log(e)
    })
  }
  stop () {
    this.audio.pause()
  }
}

let weather = new Weather('Weather', {zip: '98335', countryCode: 'us'})

let npr = new AudioStream('NPR Stream', {stream: 'https://nprdmp-live01-mp3.akacast.akamaistream.net/7/998/364916/v1/npr.akacast.akamaistream.net/nprdmp_live01_mp3'})

console.log(npr.name)

Vue.use(Quasar) // Install Quasar Framework
Vue.use(Vuex)

const store = new Vuex.Store({
  strict: process.env.NODE_ENV,
  state: {
    count: 0,
    procedures: [weather],
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
