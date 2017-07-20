<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <h1> {{ title }} </h1>
    {{ background }}
    <button :class="{ isShown: alarmOff }" v-on:click="stopAlarm">Stop Alarm</button>
    <clock v-on:updateTime="updateTime"></clock>
    <alarm v-for="alarm in alarms" v-on:initAlarm="initAlarm" :name="alarm.name" :time="time" :procedures="procedures"></alarm>
    <p> Alarm set to {{ alarm }} </p>
    <h3> Current procedures </h3>
    <ul>
      <li v-for="(proc, index) in userProcedures">
        {{ proc.name }}
        <button v-on:click="removeUserProcedure(index)"> Remove </button>
      </li>
    </ul>
    <h3> Available Procedures </h3>
    <procedures></procedures>
    <h3> Create Procedure</h3>
    <audio-stream></audio-stream>
    <weather></weather>
    <h3> Clear Storage </h3>
    <button v-on:click="clearStorage">Clear Storage</button>
  </div>
</template>

<script>
import Clock from 'components/Clock'
import Alarm from 'components/Alarm'
import Procedures from 'components/Procedures'
import Weather from 'components/Weather'
import AudioStream from 'components/AudioStream'
import { LocalStorage } from 'quasar'
// import axios from 'axios'

export default {
  components: { Clock, Alarm, Procedures, Weather, AudioStream },
  data () {
    return { title: 'Clock',
      alarm: null,
      alarms: [{name: 'Default'}],
      time: null,
      newClockName: null,
      procedures: this.$store.state.procedures,
      userProcedures: this.$store.state.userProcedures
    }
  },
  methods: {
    updateTime: function (time) {
      this.time = time
    },
    initAlarm: function (alarm) {
      this.alarm = alarm
    },
    addAlarm: function () {
      this.alarms.push({name: this.newClockName})
      this.alarmProcedures.procedures[0].trigger()
    },
    stopAlarm: function () {
      this.$store.commit('alarmOff')
      this.$store.state.userProcedures[0].stop()
    },
    removeUserProcedure: function (index) {
      this.$store.dispatch('removeUserProcedure', index)
    },
    clearStorage: function () {
      console.log('cleared')
      LocalStorage.clear('procedures')
      LocalStorage.clear('userProcedures')
    }
  },
  computed: {
    background: function () {
      if (typeof cordova !== 'undefined') {
        return 'Android'
      }
      else {
        return 'not android'
      }
    },
    alarmOff: function () {
      return this.$store.state.alarmOff
    }
  },
  beforeMount: function () {
    if (typeof cordova !== 'undefined') {
      cordova.plugins.backgroundMode.enable()
    }
  }
}
</script>

<style>
.isShown {
  display: none;
}
</style>
