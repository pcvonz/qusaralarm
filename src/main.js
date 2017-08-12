// === DEFAULT / CUSTOM STYLE ===
// WARNING! always comment out ONE of the two require() calls below.
// 1. use next line to activate CUSTOM STYLE (./src/themes)
require(`./themes/app.${__THEME}.styl`)
// 2. or, use next line to activate DEFAULT QUASAR STYLE
// require(`quasar/dist/quasar.${__THEME}.css`) // ==============================

import Vue from 'vue'
import Quasar from 'quasar'
import router from './router'
import Vuex from 'vuex'
import axios from 'axios'
import Habitica from 'habitica'
import config from './config.js'

// import moment from 'moment'
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

class AndroidAudio extends AlarmProcedure {
  constructor (name, options) {
    super(name, options, 'playlist')
  }
  set media (value) {
    console.log('I SET IT OK')
    console.log(value)
    this.media = value
  }
  trigger () {
    let playlist
    axios.get(this.options['stream']).then(response => {
      var re = /^\s*\n/gm
      playlist = response.data.replace(re, '').split('\n').slice(2)
      this.media = new Media(playlist[0], () => {
        console.log('audio play success')
      }, (err) => {
        console.log(err)
      })
      this.media.play()
    })
    // Locally scoped so Vuex store is not mutated
    let timeOut = this.options.timeOut
    if (timeOut != null) {
      let timeOutID = setInterval(() => {
        timeOut--
        if (timeOut <= 0) {
          if (store.state.userProcedures.length > 0) {
            store.dispatch('playNextUserProcedure')
          }
          else {
            store.dispatch('playNextUserProcedure')
          }
          this.media.stop()
          clearInterval(timeOutID)
        }
      }, 1000)
    }
  }
  stop () {
    this.media.stop()
  }
  set setOptions (newOptions) {
    this.options = newOptions
  }
}

class HabiticaDailies extends AlarmProcedure {
  constructor (name, options) {
    super(name, options, 'habiticadailies')
    this.api = new Habitica({
      id: options.uidKey,
      apiToken: options.apiKey
    })
    this.tag = options.tag
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
      if (typeof cordova !== 'undefined') {
        this.speak(dueDailys)
      }
    })
    // Get todo tasks by tag name (needs to get ID first then todo by tagid
    if (this.tag) {
      this.api.get('/tags').then(function (res) {
        res.data.forEach(function (d) {
          if (d['name'] === this.tag) {
            let tagId = d['id']
            this.api.get('/tasks/user').then((res) => {
              let taskList = []
              res.data.forEach(function (d) {
                if (d.tags.indexOf(tagId) > -1 && d.type === 'todo') {
                  taskList.push(d.text)
                }
              })
              let taskString = `You have ${taskList.length} tasks due today: ${taskList.join(', ')}`
              if (typeof cordova !== 'undefined') {
                this.speak(taskString)
              }
            })
          }
        }.bind(this))
      }.bind(this))
    }
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
    this.WEATHER_API = config.WEATHER_API
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
  switch (object.type) {
    case 'weather':
      return new WeatherClass(object.name, object.options)
    case 'audiostream':
      return new AudioStream(object.name, object.options)
    case 'habiticadailies':
      return new HabiticaDailies(object.name, object.options)
    case 'playlist':
      return new AndroidAudio(object.name, object.options)
  }
}

let weather = new WeatherClass('Weather', {zip: '98335', countryCode: 'us', unit: 'imperial'})

let npr = new AudioStream('NPR Stream', {stream: 'https://nprdmp-live01-mp3.akacast.akamaistream.net/7/998/364916/v1/npr.akacast.akamaistream.net/nprdmp_live01_mp3', timeOut: null})
let fluid = new AndroidAudio('Fluid Radio', {stream: 'http://webcast-connect.net/value/uk4/9270/listen.m3u', timeOut: null})

Vue.use(Quasar) // Install Quasar Framework
Vue.use(Vuex)

const store = new Vuex.Store({
  strict: true,
  state: {
    count: null,
    procedures: [],
    procedureQueue: [],
    alarmIndex: 0,
    // Sort based on alarm time?
    // If it's sorted it needs to be sorted by the time closest
    // to the current time...
    alarms: {
      0: {title: 'Default', procedures: [], alarm: '8:00', days: { Monday: true, Tuesday: true, Wednesday: true, Thursday: false, Friday: true, Saturday: true, Sunday: true }, armed: true},
      1: {title: 'Default', procedures: [], alarm: '8:00', days: { Monday: true, Tuesday: true, Wednesday: true, Thursday: true, Friday: true, Saturday: true, Sunday: true }, armed: true},
      2: {title: 'Default', procedures: [], alarm: '8:00', days: { Monday: true, Tuesday: true, Wednesday: true, Thursday: true, Friday: true, Saturday: true, Sunday: true }, armed: true},
      3: {title: 'Default', procedures: [], alarm: '8:00', days: { Monday: true, Tuesday: true, Wednesday: true, Thursday: true, Friday: true, Saturday: true, Sunday: true }, armed: true}
    },
    triggered: true
  },
  mutations: {
    addProcedure (state, p) {
      state.procedures.push(p)
    },
    addUserProcedure (state, p) {
      state.alarms[p.id].procedures.push(p.procedure)
    },
    removeProcedure (state, pindex) {
      state.procedures.splice(pindex, 1)
    },
    removeUserProcedure (state, p) {
      state.alarms[p.id].procedures.splice(p.index, 1)
    },
    createStream (state, p) {
      let stream = new AudioStream(p.name, {stream: p.options.stream, timeOut: p.options.timeOut})
      state.procedures.push(stream)
      Quasar.LocalStorage.set('procedures', state.procedures)
    },
    createPlaylist (state, p) {
      let stream = new AndroidAudio(p.name, {stream: p.options.stream, timeOut: p.options.timeOut})
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
    // Procedure queue is added to when an
    // alarm equals the current time.
    addToProcedureQueue (state, p) {
      state.procedureQueue = state.procedureQueue.concat(p)
    },
    removeFirstUserProcedure (state) {
      state.procedureQueue.shift()
    },
    updateProc (state, options) {
      console.log(options)
      state.procedures[options.pindex].options[options.key] = options.value
    },
    updateAlarm (state, options) {
      state.alarms[options.id].alarm = options.time
    },
    updateTitle (state, options) {
      state.alarms[options.id].title = options.title
    },
    updateUserProc (state, options) {
      state.alarms[options.id].procedures[options.pindex].options[options.key] = options.value
    },
    sortProcedureQueue (state, time) {
      // Eventually will sort alarms by proximity to current time
     //  var mom = moment()
     //  var timeArrayTwo = state.alarms[0].alarm.split(':')
     //  var mom2 = moment().set({'hour': timeArrayTwo[0], 'minute': timeArrayTwo[1]})
    },
    toggleAlarm (state, options) {
      store.state.alarms[options.id].armed = options.value
    },
    updateProcList (state, options) {
      store.state.alarms[options.id].procedures = options.list
    },
    clearProcedureQueue (state) {
      store.state.procedureQueue = []
    },
    updateDay (state, options) {
      state.alarms[options.id].days[options.day] = options.value
    }
  },
  actions: {
    updateDay (state, options) {
      options = {id: options.id, day: options.day, value: !store.state.alarms[options.id].days[options.day]}
      store.commit('updateDay', options)
      Quasar.LocalStorage.set('alarms', store.state.alarms)
    },
    addProcedure (state, p) {
      store.commit('addProcedure', p)
      Quasar.LocalStorage.set('procedures', store.state.procedures)
    },
    addUserProcedure (state, p) {
      store.commit('addUserProcedure', p)
      Quasar.LocalStorage.set('alarms', store.state.alarms)
    },
    removeProcedure (state, pindex) {
      store.commit('removeProcedure', pindex)
      Quasar.LocalStorage.set('procedures', store.state.procedures)
    },
    removeUserProcedure (state, p) {
      store.commit('removeUserProcedure', p)
      Quasar.LocalStorage.set('alarms', store.state.alarms)
    },
    updateProc (state, options) {
      store.commit('updateProc', options)
    },
    updateProcList (state, options) {
      store.commit('updateProcList', options)
      Quasar.LocalStorage.set('alarms', store.state.alarms)
    },
    updateUserProc (state, options) {
      store.commit('updateUserProc', options)
    },
    stopCurrentProcedure (state) {
      store.state.procedureQueue[0].stop()
      store.commit('clearProcedureQueue')
    },
    playCurrentUserProcedure (state) {
      if (store.state.procedureQueue.length > 0) {
        store.state.procedureQueue[0].trigger()
      }
    },
    updateAlarm (state, options) {
      state.commit('updateAlarm', options)
      Quasar.LocalStorage.set('alarms', store.state.alarms)
    },
    updateTitle (state, options) {
      state.commit('updateTitle', options)
      Quasar.LocalStorage.set('alarms', store.state.alarms)
    },
    toggleAlarm (state, options) {
      state.commit('toggleAlarm', options)
      Quasar.LocalStorage.set('alarms', store.state.alarms)
    },
    playNextUserProcedure (state, id) {
      if (store.state.procedureQueue.length > 1) {
        store.commit('removeFirstUserProcedure')
        store.state.procedureQueue[0].trigger()
      }
      else if (store.state.procedureQueue.length === 1) {
        store.commit('removeFirstUserProcedure')
      }
    },
    testHabitica (options) {
      let test = new HabiticaDailies(options.name, options)
      test.trigger()
    }
  }
})

store.commit('addProcedure', weather)
store.commit('addProcedure', npr)
store.commit('addProcedure', fluid)

// Custom directive for autofocus on load

Vue.directive('focus', {
  inserted: function (el, binding, vnode) {
    el.focus()
    setTimeout(function () { el.click() }, 1)
  }
})

// Init tempProcedures
let local = Quasar.LocalStorage
// local.clear('userProcedures')
if (local.get.item('alarms') !== null && local.get.item('alarms') !== 'undefined') {
  var alarms = local.get.item('alarms')
  for (var index in alarms) {
    for (var proc of alarms[index].procedures) {
      store.commit('addUserProcedure', {id: index, procedure: assignClass(proc)})
    }
    // TODO: Combine these two for loops
    for (var day of Object.keys(alarms[index].days)) {
      store.commit('updateDay', {day: day, id: index, value: alarms[index].days[day]})
    }
    store.commit('updateAlarm', {time: alarms[index].alarm, id: index})
    store.commit('toggleAlarm', {value: alarms[index].armed, id: index})
    store.commit('updateTitle', {title: alarms[index].title, id: index})
  }
}
if (Quasar.LocalStorage.get.item('procedures') != null && local.get.item('procedures') !== 'undefined') {
  Quasar.LocalStorage.get.item('procedures').forEach(function (p) {
    if (!(p.name === 'NPR Stream' || p.name === 'Weather' || p.name === 'Fluid Radio')) {
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
