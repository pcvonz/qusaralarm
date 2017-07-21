<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
  <q-layout>
    <div slot="header"> 
      <button class="hide-on-drawer-visible" @click="$refs.leftDrawer.open()">
        <i>menu</i>
      </button>
      {{ title }} 
    </div> 
    <button :class="{ isShown: alarmOff }" v-on:click="stopAlarm">Stop Alarm</button>
    <div class="list">
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
    </div>
    <q-drawer ref="leftDrawer">
      <div class="list platform-delimter">
        <div class="list-header">
          Create or add existing procedures
        </div>
        <h3> Available Procedures </h3>
        <procedures></procedures>
        <h3> Create Procedure</h3>
        <audio-stream></audio-stream>
        <weather></weather>
        <habitica></habitica>
        <h3> Clear Storage </h3>
        <button v-on:click="clearStorage">Clear Storage</button>
      </div>
    </q-drawer>
  </q-layout>
  </div>
</template>

<script>
import Clock from './Clock'
import Alarm from './Alarm'
import Procedures from './Procedures'
import Weather from './Weather'
import AudioStream from './AudioStream'
import Habitica from './Habitica'
import { LocalStorage } from 'quasar'
// import axios from 'axios'

export default {
  components: { Clock, Alarm, Procedures, Weather, AudioStream, Habitica },
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
