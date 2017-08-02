<template>
  <!-- Don't drop "q-app" class -->
    <q-layout>
    <div class="layout-view">
      <div class="list">
        <div v-on:click="changeTitle"> 
          <input :class="{ isShown: titleShown }" v-on:blue="changeTitle" v-model:title="title" type="text"/>
          <p :class="{ isShown: !titleShown }"> {{ title }} </p>
        </div>
        <button :class="{ isShown: alarmOff }" v-on:click="stopAlarm">Stop Alarm</button>
        <clock id="clock" v-on:updateTime="updateTime"></clock>
        <p> Alarm: {{ alarm }} </p>
        <alarm v-for="alarm in alarms" :name="alarm.name" :day="day" :time="time" :id="id"></alarm>
        <p> Alarm goes off in {{ timeUntil }} hours </p>
        <h5> Current procedures </h5>
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
import Podcast from './Podcast'
import { LocalStorage } from 'quasar'
import moment from 'moment'
// import axios from 'axios'

export default {
  components: { Podcast, Clock, Alarm, Procedures, UserProcedures, Weather, AudioStream, Habitica },
  data () {
    return {
      titleShown: true,
      id: this.$route.params.id,
      alarms: [{name: 'Default'}],
      time: null,
      day: null,
      newClockName: null,
      procedures: this.$store.state.procedures,
      userProcedures: this.$store.state.alarms[this.$route.params.id].procedures
    }
  },
  methods: {
    updateTime: function (time, day) {
      this.time = time
      this.day = day
    },
    addAlarm: function () {
      this.alarms.push({name: this.newClockName})
      this.alarmProcedures.procedures[0].trigger()
    },
    addNewAlarm: function () {
    },
    stopAlarm: function () {
      this.$store.dispatch('stopCurrentProcedure')
    },
    removeUserProcedure: function (index) {
      this.$store.dispatch('removeUserProcedure', {id: this.id, index: index})
    },
    clearStorage: function () {
      console.log('cleared')
      LocalStorage.clear('procedures')
      LocalStorage.clear('alarms')
    },
    changeTitle: function (e) {
      if (e.target.tagName === 'P' || e.target.tagName === 'DIV') {
        this.titleShown = !this.titleShown
      }
      else {
        e.target.focus()
      }
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
    title: {
      get: function () {
        return this.$store.state.alarms[this.id].title
      },
      set: function (newTitle) {
        this.$store.dispatch('updateTitle', {id: this.id, title: newTitle})
      }
    },
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
    },
    formatAlarm: function () {
      if (this.alarm != null) {
        var formatTime = this.alarm.split(':')
        return moment({'hours': formatTime[0], 'minutes': formatTime[1]}).format('h:mm A')
      }
    },
    alarm: {
      get: function () {
        let formatTime = this.$store.state.alarms[this.id].alarm.split(':')
        return moment({'hours': formatTime[0], 'minutes': formatTime[1]}).format('h:mm A')
      },
      set: function () {
      }
    },
    timeUntil: function () {
      let alarm = this.$store.state.alarms[this.id].alarm.split(':')
      // If the alarm is in the past, add a day
      let notify = moment().hours(alarm[0], 'hours').minutes(alarm[1], 'minutes')
      if (notify.diff(moment()) < 0) {
        notify = notify.add(1, 'day')
      }
      // return moment().diff(notify, 'hours')
      let hours = notify.diff(moment(), 'hours')
      let minutes = moment(notify.diff(moment())).minutes()
      return `${hours} hours and  ${minutes} minutes`
    }
  },
  beforeMount: function () {
    if (typeof cordova !== 'undefined') {
      let alarmTime = this.$store.state.alarms[this.id].alarm.split(':')
      // If the alarm is in the past, add a day
      let notify = moment().hours(alarmTime[0]).minutes(alarmTime[1])
      if (moment().diff(notify) < 0) {
        notify.add(1, 'day')
      }
      // set background mode
      cordova.plugins.backgroundMode.enable()
      cordova.plugins.backgroundMode.setDefaults({
        title: 'Alarm clock',
        text: this.timeUntil
      })
      cordova.plugins.notification.local.schedule({
        id: this.id,
        every: 'day',
        at: notify.toDate()
      })
      cordova.plugins.notification.local.on('trigger', (notification) => {
        console.log('trigger')
        cordova.plugins.backgroundMode.unlock()
        let alarm = this.$store.state.alarms[notification.id]
        if (alarm.armed === true && alarm.days[this.day]) {
          this.$store.commit('addToProcedureQueue', alarm.procedures)
          this.$store.dispatch('playCurrentUserProcedure')
        }
        else {
          cordova.plugins.notification.local.cancel(this.id, () => {
            console.log('canceled')
          })
        }
      })
    }
  }
}
</script>

<style>
.isShown {
  display: none;
}

#clock {
  display: flex;
  justify-content: center;
  font-size: 3em;
  font-family: "Alte DIN 1451 Mittelschrift";
}

</style>
