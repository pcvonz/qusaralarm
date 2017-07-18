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
      <li v-for="proc in procedures">
        {{ proc.name }}
      </li>
    </ul>
    <h3> Available Procedures </h3>
    <procedures v-on:addProcedure="addProcedure"></procedures>
  </div>
</template>

<script>
import Clock from 'components/Clock'
import Alarm from 'components/Alarm'
import Procedures from 'components/Procedures'
// import axios from 'axios'

export default {
  components: { Clock, Alarm, Procedures },
  data () {
    return { title: 'Clock',
      alarm: null,
      alarms: [{name: 'Default'}],
      time: null,
      newClockName: null,
      procedures: []
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
    addProcedure: function (proc) {
      this.procedures.push(proc)
      console.log(this.procedures)
    },
    stopAlarm: function () {
      console.log('hello?')
      this.$store.commit('alarmOff')
      this.$store.state.procedures[0].stop()
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
