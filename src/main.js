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

// API Constants

const WEATHER_API = 'ff87b07316bb79c4e2e28f37ffe61dbf'

// Cordova plugins

class AlarmProcedure {
  constructor (name, options) {
    this.name = name
    this.options = options
  }
}

class AudioStream extends AlarmProcedure {
  constructor (name, options) {
    super()
    this.audio = new Audio()
  }

  trigger () {
    this.audio.src = this.options['stream']
    this.audio.play()
    setInterval(this.playUntilTimeout, 1000)
  }
  playUntilTimeout () {
    this.options.timeOut--
    if (this.options.timeOut <= 0) {
      this.audio.pause()
    }
  }
  stop () {
    this.audio.pause()
  }
}

class Weather extends AlarmProcedure {
  super (name, options) {
    this.name = name
    this.options = options
  }
  speak (string, cb) {
    TTS.speak(string, function () {
      cb()
    }, function (reason) {
      cb()
    })
  }
  trigger (cb) {
    let getUrl = `http://api.openweathermap.org/data/2.5/weather?zip=${this.options.zip},${this.options.countryCode}&APPID=${WEATHER_API}`
    console.log(getUrl)
    axios.get(`http://api.openweathermap.org/data/2.5/weather?zip=${this.options.zip},${this.options.countryCode}&units=${this.options.unit}&APPID=${WEATHER_API}`).then(response => {
      let data = response.data
      console.log(data)
      let weatherString = `The current weather is: ${data.weather[0].description}
The current temperature is ${data.main.temp}, with a low of ${data.main.temp_min} and a high of ${data.main.temp_max}`
      if (typeof cordova !== 'undefined') {
        this.speak(weatherString, cb)
      }
      else {
        cb()
      }
    }).catch(e => {
      console.log(e)
    })
  }
  stop () {
    this.audio.pause()
  }
}

let weather = new Weather('Weather', {zip: '98335', countryCode: 'us', unit: 'imperial'})

let npr = new AudioStream('NPR Stream', {stream: 'https://nprdmp-live01-mp3.akacast.akamaistream.net/7/998/364916/v1/npr.akacast.akamaistream.net/nprdmp_live01_mp3', timeOut: 5})

console.log(npr.name)

Vue.use(Quasar) // Install Quasar Framework
Vue.use(Vuex)

const store = new Vuex.Store({
  strict: process.env.NODE_ENV,
  state: {
    count: 0,
    procedures: [npr, weather],
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
