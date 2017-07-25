<template>
  <!-- Don't drop "q-app" class -->
    <q-layout>
    <div slot="header">
      <button v-on:click="addNewAlarm"><i>add</i></button>
    </div>
    <div class="layout-view">
      <div class="list">
        {{ $route.params.id }}
        {{ title }} 
        <button :class="{ isShown: alarmOff }" v-on:click="stopAlarm">Stop Alarm</button>
        <clock v-on:updateTime="updateTime"></clock>
        <alarm v-for="alarm in alarms" v-on:initAlarm="initAlarm" :name="alarm.name" :time="time" :procedures="procedures"></alarm>
        <p> Alarm set to {{ alarm }} </p>
        <h3> Current procedures </h3>
          <user-procedures :id="id" :procedureObject="userProcedures"></user-procedures>
          <div class="list-header">
            <button class="primary" @click="$refs.addProcedureModal.open()"> Create or add existing procedures</button>
          </div>
      </div>
    </div>
      <q-modal slot="navigation" ref="addProcedureModal">
          <q-tabs :refs="$refs" default-tab="tab-1">
            <button @click="$refs.addProcedureModal.close()"><i>arrow_back</i></button>
            <q-tab name="tab-1">
              Add
            </q-tab>
            <q-tab name="tab-2">
              Create
            </q-tab>
          </q-tabs>
            
            <div ref="tab-1">
              <procedures :id="id" :procedureObject="procedures"></procedures>
            </div>
            <div ref="tab-2">
              <audio-stream></audio-stream>
              <weather></weather>
              <habitica></habitica>
              <h3> Clear Storage </h3>
              <button v-on:click="clearStorage">Clear Storage</button>
            </div>
      </q-modal>
  <div slot="footer">
    <router-link to="/alarm/0"> <button> <i>alarm</i> </button> </router-link>
    <router-link to="/alarm/1"> <button> <i>alarm</i> </button> </router-link>
    <router-link to="/alarm/2"> <button> <i>alarm</i> </button> </router-link>
    <router-link to="/alarm/3"> <button> <i>alarm</i> </button> </router-link>
  </div>
  </q-layout>
</template>

<script>
import Clock from './Clock'
import Alarm from './Alarm'
import Procedures from './Procedures'
import UserProcedures from './UserProcedures'
import Weather from './Weather'
import AudioStream from './AudioStream'
import Habitica from './Habitica'
import { LocalStorage } from 'quasar'
// import axios from 'axios'

export default {
  components: { Clock, Alarm, Procedures, UserProcedures, Weather, AudioStream, Habitica },
  data () {
    return { title: 'Clock',
      alarm: null,
      id: this.$route.params.id,
      alarms: [{name: 'Default'}],
      time: null,
      newClockName: null,
      procedures: this.$store.state.procedures,
      userProcedures: this.$store.state.alarms[this.$route.params.id].procedures
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
    addNewAlarm: function () {
      console.log('hello')
    },
    stopAlarm: function () {
      this.$store.commit('alarmOff')
      this.$store.state.userProcedures[0].stop()
    },
    removeUserProcedure: function (index) {
      this.$store.dispatch('removeUserProcedure', {id: this.id, index: index})
    },
    clearStorage: function () {
      console.log('cleared')
      LocalStorage.clear('procedures')
      LocalStorage.clear('userProcedures')
    }
  },
  watch: {
    '$route' (to, from) {
      this.userProcedures = this.$store.state.alarms[this.$route.params.id].procedures
      this.alarm = this.$store.state.alarms[this.$route.params.id].alarm
      this.id = this.$route.params.id
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
