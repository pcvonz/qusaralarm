// === DEFAULT / CUSTOM STYLE ===
// WARNING! always comment out ONE of the two require() calls below.
// 1. use next line to activate CUSTOM STYLE (./src/themes)
// require(`./themes/app.${__THEME}.styl`)
// 2. or, use next line to activate DEFAULT QUASAR STYLE
require(`quasar/dist/quasar.${__THEME}.css`) // ==============================

import Vue from 'vue'
import Quasar from 'quasar'
import router from './router'
import Vuex from 'vuex'
import axios from 'axios'

// Cordova plugins

class AlarmProcedure {
  constructor (name, options) {
    this.name = name
    this.options = options
  }
  static get name () {
    return this.name
  }
  static get options () {
    return this.options
  }
}

class AudioStream extends AlarmProcedure {
  constructor (name, options) {
    super(name, options)
    this.audio = new Audio()
  }

  trigger (cb) {
    this.audio.src = this.options['stream']
    this.audio.play()
    // Locally scoped so Vuex store is not mutated
    let timeOut = this.options.timeOut
    if (timeOut != null) {
      let timeOutID = setInterval(function () {
        timeOut--
        if (timeOut <= 0) {
          if (store.state.userProcedures.length > 0) {
            store.commit('nextProcedure')
            cb.trigger(store.state.userProcedures[0])
          }
          else {
            if (typeof cb.trigger !== 'undefined') { cb.trigger() }
          }
          this.audio.pause()
          clearInterval(timeOutID)
        }
      }.bind(this), 1000)
    }
  }
  stop () {
    this.audio.pause()
  }
  set setOptions (newOptions) {
    this.options = newOptions
  }
}

class Weather extends AlarmProcedure {
  constructor (name, options) {
    super(name, options)
    this.WEATHER_API = 'ff87b07316bb79c4e2e28f37ffe61dbf'
  }
  speak (string, cb) {
    TTS.speak(string, function () {
      console.log('speak success')
      if (store.state.userProcedures.length > 0) {
        store.commit('nextProcedure')
        cb.trigger(store.state.userProcedures[0])
      }
      else {
        if (typeof cb !== 'undefined') { cb.trigger() }
      }
    }, function (reason) {
      if (store.state.userProcedures.length > 0) {
        store.commit('nextProcedure')
        cb.trigger(store.state.userProcedures[0])
      }
      else {
        if (typeof cb !== 'undefined') { cb.trigger() }
      }
      console.log(reason)
    })
  }
  trigger (cb) {
    axios.get(`http://api.openweathermap.org/data/2.5/weather?zip=${this.options.zip},${this.options.countryCode}&units=${this.options.unit}&APPID=${this.WEATHER_API}`).then(response => {
      let data = response.data
      let weatherString = `The current weather is: ${data.weather[0].description}
The current temperature is ${data.main.temp}, with a low of ${data.main.temp_min} and a high of ${data.main.temp_max}`
      if (typeof cordova !== 'undefined') {
        this.speak(weatherString, cb)
      }
      else {
        if (store.state.userProcedures.length > 0) {
          store.commit('nextProcedure')
          cb.trigger(store.state.userProcedures[0])
        }
        else {
          if (typeof cb !== 'undefined') { cb.trigger() }
        }
        console.log(weatherString)
      }
    }).catch(e => {
      console.log(e)
    })
  }
}

let weather = new Weather('Weather', {zip: '98335', countryCode: 'us', unit: 'imperial'})

let npr = new AudioStream('NPR Stream', {stream: 'https://nprdmp-live01-mp3.akacast.akamaistream.net/7/998/364916/v1/npr.akacast.akamaistream.net/nprdmp_live01_mp3', timeOut: null})

Vue.use(Quasar) // Install Quasar Framework
Vue.use(Vuex)

const store = new Vuex.Store({
  strict: process.env.NODE_ENV,
  state: {
    count: null,
    procedures: [],
    userProcedures: [],
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
    },
    addUserProcedure (state, p) {
      state.userProcedures.push(p)
      Quasar.LocalStorage.set('userProcedures', state.userProcedures)
    },
    addProcedure (state, p) {
      state.procedures.push(p)
      Quasar.LocalStorage.set('procedures', state.procedures)
    },
    createStream (state, p) {
      let stream = new AudioStream(p.name, {stream: p.options.stream, timeOut: p.options.timeOut})
      state.procedures.push(stream)
      Quasar.LocalStorage.set('procedures', state.procedures)
    },
    createWeather (state, p) {
      let weather = new Weather(p.name, p.options)
      state.procedures.push(weather)
      Quasar.LocalStorage.set('procedures', state.procedures)
    },
    nextProcedure (state) {
      state.userProcedures.shift()
    },
    updateProc (state, options) {
      console.log(options)
      state.procedures[options.pindex].options[options.key] = options.value
      console.log(state.procedures[options.pindex].options[options.key])
    }
  }
})

// Init tempProcedures
let local = Quasar.LocalStorage
if (local.get.item('userProcedures') !== null && local.get.item('userProcedures') !== 'undefined') {
  local.get.item('userProcedures').forEach(function (p) {
    store.commit('addUserProcedure', p)
  })
}
if (Quasar.LocalStorage.get.item('procedures') != null && local.get.item('procedures') !== 'undefined') {
  console.log(typeof local.get.item('procedures'))
  Quasar.LocalStorage.get.item('procedures').forEach(function (p) {
    if (!(p.name === 'NPR Stream' || p.name === 'Weather')) {
      store.commit('addProcedure', p)
    }
  })
}

store.commit('addProcedure', weather)
store.commit('addProcedure', npr)

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
