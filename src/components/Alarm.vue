<template>
  <!-- Don't drop "q-app" class -->
  <div id="alarmSettings">
    {{ name }}
    <input @input="updateAlarm" v-on:keyup.enter="initAlarm" type="time">
    <q-toggle :value="value" @input="alarmToggle"></q-toggle>
    <div id="days">
      <label v-for="key in Object.keys(alarms[this.id].days)">
        <q-checkbox :value="alarms[id].days[key]" @input="updateDay(key)"></q-checkbox>
        {{ key.slice(0, 2) }}
      </label>
    </div>
    <button v-on:click="updateDebug">Debug </button>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'alarm',
  props: ['day', 'time', 'name', 'procedures', 'id'],
  data () {
    return {
      alarms: this.$store.state.alarms
    }
  },
  methods: {
    iterateAlarms: function () {
      for (var id in this.alarms) {
        this.checkAlarm(this.alarms[id])
      }
    },
    updateDay: function (day) {
      this.$store.dispatch('updateDay', { id: this.id, day: day })
    },
    checkAlarm: function (alarm) {
      let alarmComp = moment().hours(alarm.alarm.split(':')[0]).minutes(alarm.alarm.split(':')[1]).seconds('00').format('HH:mm:ss')
      if (this.time === alarmComp && alarm.armed === true && alarm.days[this.day]) {
        if (typeof cordova !== 'undefined') {
          cordova.plugins.backgroundMode.moveToForeground()
        }
        this.$store.commit('addToProcedureQueue', alarm.procedures)
        this.$store.dispatch('playCurrentUserProcedure', alarm.procedures)
      }
    },
    // doesn't actually do anything
    initAlarm: function (e) {
      // this.$store.dispatch('updateAlarm', {time: e.target.value + ':00', id: this.id})
    },
    updateDebug: function () {
      let alarmTime = this.$store.state.alarms[this.id].alarm.split(':')
      let notify = moment().add(5, 'seconds').hours(alarmTime[0]).minutes(alarmTime[1]).seconds('00')
      if (typeof cordova !== 'undefined') {
        cordova.plugins.notification.local.schedule({
          id: this.id,
          every: 'day',
          at: notify.toDate()
        })
      }
    },
    updateAlarm: function (e) {
      if (typeof e !== 'undefined') {
        this.$store.dispatch('updateAlarm', {time: e.target.value + ':00', id: this.id})
        let alarmTime = this.$store.state.alarms[this.id].alarm.split(':')
        let notify = moment().hours(alarmTime[0]).minutes(alarmTime[1]).seconds('00')
        if (moment().diff(notify) < 0) {
          notify.add(1, 'day')
        }
        this.$emit('updateAlarm', alarmTime)
        this.$store.commit('sortProcedureQueue', this.time)
        console.log('updating alarm')
        if (typeof cordova !== 'undefined') {
          cordova.plugins.notification.local.schedule({
            id: this.id,
            every: 'day',
            at: notify.toDate()
          })
          cordova.plugins.notification.local.getAll((not) => {
            console.log('notifications active:')
            console.log(not)
          })
        }
      }
    },
    alarmToggle: function (checked) {
      this.$store.dispatch('toggleAlarm', {value: !this.value, id: this.id})
    }
  },
  computed: {
    value: function () {
      return this.$store.state.alarms[this.id].armed
    }
  },
  mounted: function () {
    // this.initAlarm()
    this.iterateAlarms()
    setInterval(this.iterateAlarms, 1000)
  }
}
</script>

<style>
#days {
  display: flex;

}
#alarmSettings {
  background-color: #777487;
}
</style>
