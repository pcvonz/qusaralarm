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
import Habitica from 'habitica'

class AlarmProcedure {
  constructor (name, options, type) {
    this.name = name
    this.options = options
    this.type = type
  }
  static get name () {
    return this.name
  }
  static get options () {
    return this.options
  }
  speak (string) {
    TTS.speak(string, function () {
      console.log('speak success')
      store.dispatch('playNextUserProcedure')
    }, function (reason) {
      store.dispatch('playNextUserProcedure')
      console.log(reason)
    })
  }
}

class HabiticaDailies extends AlarmProcedure {
  constructor (name, options) {
    super(name, options, 'HabiticaDalies')
    this.api = new Habitica({
      id: options.uidKey,
      apiToken: options.apiKey
    })
  }
  trigger () {
    this.api.get('/tasks/user?type=dailys').then((res) => {
      let dailyList = []
      res.data.forEach(function (d) {
        if (d.isDue) {
          dailyList.push(d.text)
        }
      })
      let dueDailys = `You have ${dailyList.length} dailies due today: ${dailyList.join(', ')}`
      console.log(dueDailys)
      if (typeof cordova !== 'undefined') {
        this.speak(dueDailys)
      }
    })
  }
}

class AudioStream extends AlarmProcedure {
  constructor (name, options) {
    super(name, options, 'audiostream')
    this.audio = new Audio()
  }

  trigger () {
    this.audio.src = this.options['stream']
    this.audio.play()
    // Locally scoped so Vuex store is not mutated
    let timeOut = this.options.timeOut
    if (timeOut != null) {
      let timeOutID = setInterval(function () {
        timeOut--
        if (timeOut <= 0) {
          if (store.state.userProcedures.length > 0) {
            store.dispatch('playNextUserProcedure')
          }
          else {
            store.dispatch('playNextUserProcedure')
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

const WeatherClass = class Weather extends AlarmProcedure {
  constructor (name, options) {
    super(name, options, 'weather')
    this.WEATHER_API = 'ff87b07316bb79c4e2e28f37ffe61dbf'
  }
  trigger () {
    axios.get(`http://api.openweathermap.org/data/2.5/weather?zip=${this.options.zip},${this.options.countryCode}&units=${this.options.unit}&APPID=${this.WEATHER_API}`).then(response => {
      let data = response.data
      let weatherString = `The current weather is: ${data.weather[0].description}
The current temperature is ${data.main.temp}, with a low of ${data.main.temp_min} and a high of ${data.main.temp_max}`
      if (typeof cordova !== 'undefined') {
        this.speak(weatherString)
      }
      else {
        store.dispatch('playNextUserProcedure')
        console.log(weatherString)
      }
    }).catch(e => {
      console.log(e)
    })
  }
}

function assignClass (object) {
  if (object.type === 'weather') {
    return new WeatherClass(object.name, object.options)
  }
}

let weather = new WeatherClass('Weather', {zip: '98335', countryCode: 'us', unit: 'imperial'})

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
    addProcedure (state, p) {
      state.procedures.push(p)
    },
    addUserProcedure (state, p) {
      state.userProcedures.push(p)
    },
    removeProcedure (state, pindex) {
      state.procedures.splice(pindex, 1)
    },
    removeUserProcedure (state, pindex) {
      state.userProcedures.splice(pindex, 1)
    },
    createStream (state, p) {
      let stream = new AudioStream(p.name, {stream: p.options.stream, timeOut: p.options.timeOut})
      state.procedures.push(stream)
      Quasar.LocalStorage.set('procedures', state.procedures)
    },
    createWeather (state, p) {
      let weather = new WeatherClass(p.name, p.options)
      state.procedures.push(weather)
      Quasar.LocalStorage.set('procedures', state.procedures)
    },
    createHabitica (state, p) {
      let habitica = new HabiticaDailies(p.name, p.options)
      state.procedures.push(habitica)
      Quasar.LocalStorage.set('procedures', state.procedures)
    },
    removeFirstUserProcedure (state) {
      state.userProcedures.shift()
    },
    updateProc (state, options) {
      state.procedures[options.pindex].options[options.key] = options.value
    }
  },
  actions: {
    addProcedure (state, p) {
      store.commit('addProcedure', p)
      Quasar.LocalStorage.set('procedures', store.state.procedures)
    },
    addUserProcedure (state, p) {
      store.commit('addUserProcedure', p)
      Quasar.LocalStorage.set('userProcedures', store.state.userProcedures)
    },
    removeProcedure (state, pindex) {
      store.commit('removeProcedure', pindex)
      Quasar.LocalStorage.set('procedures', store.state.procedures)
    },
    removeUserProcedure (state, pindex) {
      store.commit('removeUserProcedure', pindex)
      Quasar.LocalStorage.set('userProcedures', store.state.userProcedures)
    },
    updateProc (state, options) {
      store.commit('updateProc', options)
    },
    playCurrentUserProcedure () {
      store.state.userProcedures[0].trigger()
    },
    playNextUserProcedure () {
      if (store.state.userProcedures.length > 1) {
        store.commit('removeFirstUserProcedure')
        store.state.userProcedures[0].trigger()
      }
      else if (store.state.userProcedures.length === 1) {
        store.commit('removeFirstUserProcedure')
      }
    }
  }
})

store.commit('addProcedure', weather)
store.commit('addProcedure', npr)

// Init tempProcedures
let local = Quasar.LocalStorage
// local.clear('userProcedures')
console.log(local.get.item('userProcedures'))
if (local.get.item('userProcedures') !== null && local.get.item('userProcedures') !== 'undefined') {
  local.get.item('userProcedures').forEach(function (p) {
    console.log('Loaded user prototype')
    console.log(p)
    store.commit('addUserProcedure', assignClass(p))
  })
  Quasar.LocalStorage.set('userProcedures', store.state.userProcedures)
}
if (Quasar.LocalStorage.get.item('procedures') != null && local.get.item('procedures') !== 'undefined') {
  Quasar.LocalStorage.get.item('procedures').forEach(function (p) {
    if (!(p.name === 'NPR Stream' || p.name === 'Weather')) {
      console.log('add procedure from local storage')
      store.commit('addProcedure', assignClass(p))
    }
  })
  Quasar.LocalStorage.set('procedures', store.state.procedures)
}

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
