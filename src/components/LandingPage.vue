<template>
  <!-- Don't drop "q-app" class -->
    <q-layout>
    <div class="layout-view">
        <div class="main">
          <div v-on:click="changeTitle"> 
            <input :class="{ isShown: titleShown }" v-on:blur="changeTitle" v-model:title="title" type="text"/>
            <p :class="{ isShown: !titleShown }"> {{ title }} </p>
          </div>
          <input-hide text="hello" > </input-hide>
          <div class="hide" :class="{ alarmModal: alarmShown}">
            <button v-on:click="stopAlarm">Stop Alarm</button>
          </div>
          <clock id="clock" v-on:updateTime="updateTime"></clock>
          <alarm v-for="alarm in alarms" v-on:triggerAlarm="triggerAlarm" v-on:updateAlarm="updateAlarm" :name="alarm.name" :day="day" :time="time" :id="id"></alarm>
        </div>
          <user-procedures :id="id" :procedureObject="userProcedures"></user-procedures>
          <div class="addButton"@click="$refs.addProcedureModal.open()">
            <p> Add </p> 
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
            <div ref="tab-2">:class="" 
              <audio-stream></audio-stream>
              <weather></weather>
              <habitica></habitica>
              <h3> Clear Storage </h3>
              <button v-on:click="clearStorage">Clear Storage</button>
            </div>
      </q-modal>
  <div slot="footer">
    <router-link to="/alarm/0"> <button> <div :class="footerClass(0)"> </div> </button> </router-link>
    <router-link to="/alarm/1"> <button> <div :class="footerClass(1)"> </div> </button> </router-link>
    <router-link to="/alarm/2"> <button> <div :class="footerClass(2)"> </div> </button> </router-link>
    <router-link to="/alarm/3"> <button> <div :class="footerClass(3)"> </div> </button> </router-link>
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
import InputHide from './InputHide'
import { LocalStorage, Toast } from 'quasar'
import moment from 'moment'
// import axios from 'axios'

export default {
  components: { InputHide, Podcast, Clock, Alarm, Procedures, UserProcedures, Weather, AudioStream, Habitica },
  data () {
    return {
      titleShown: true,
      id: this.$route.params.id,
      alarms: [{name: 'Default'}],
      time: null,
      day: null,
      newClockName: null,
      procedures: this.$store.state.procedures,
      userProcedures: this.$store.state.alarms[this.$route.params.id].procedures,
      alarmShown: false
    }
  },
  methods: {
    triggerAlarm: function () {
      this.alarmShown = true
    },
    updateTime: function (time, day) {
      this.time = time
      this.day = day
    },
    updateAlarm: function () {
      if (typeof cordova !== 'undefined') {
        cordova.plugins.backgroundMode.configure({
          title: 'Alarm clock',
          text: this.timeUntil
        })
      }
      Toast.create(this.timeUntil)
    },
    addAlarm: function () {
      this.alarms.push({name: this.newClockName})
      this.alarmProcedures.procedures[0].trigger()
    },
    stopAlarm: function () {
      try {
        this.$store.dispatch('stopCurrentProcedure')
      }
      catch (e) {
        console.log('stop function doesnt exist')
      }
      this.alarmShown = false
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
    },
    footerClass: function (e) {
      if (e === parseInt(this.id)) {
        return 'circleSelected'
      }
      else {
        return 'circle'
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
      cordova.plugins.backgroundMode.setDefaults({
        title: 'Alarm clock',
        text: `Time until next alarm: ${this.timeUntil} hours`
      })
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
    }
  }
}
</script>

<style lang="scss">
$primary: #499bca;
$secondary: #4fc0e5;
$tertiary: #555;

$neutral: #E0E1E2;
$positive: #21BA45;
$negative: #DB2828;
$info: #31CCEC;
$warning: #F2C037;

$ligh: #f4f4f4;
$dark: #333;
$faded: #777;

$text-color: lighten(black, 17%);
$background-color: white;

$link-color: lighten($primary, 25%);
$link-color-active: $primary;

p {
  color: white;
}

.isShown {
  display: none !important;
  background-color: rgba(239, 103, 67, 0);
  transition: background-color .2s;
}

.hide {
  display: none;
}

.main {
  background: linear-gradient(to bottom, #4ebce2 0%,#499bca 100%);
}

#clock {
  display: flex;
  justify-content: center;
  font-size: 3em;
  font-family: "Alte DIN 1451 Mittelschrift";
}

.alarmModal {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  background-color: rgba(239, 103, 67, 0.81);
  color: white;
  z-index: 10;
  button {
    font-size: 1.5em;
  }
  transition: background-color .2s, display .2s;
}

.addButton {
  width: 160px;
  height: 48px;
  border: 4px solid white;
  margin: .4em auto;
  cursor: pointer;
  display: flex;
  justify-content: center;
  transition: border .2s;
  p {
    margin: 0;
    padding: 0;
    height: auto;
  }
}
.addButton:hover {
  border: 4px solid #e1e1e1;
}
html {
  background-color: #4A9FCD;
}
.circleSelected {
  width: 12px;
  height: 12px;
  border-radius:100%;
  border: 3px solid white;
  background-color: white;
}
.circle {
  width: 12px;
  height: 12px;
  border-radius:100%;
  border: 2px solid white;
}
</style>
