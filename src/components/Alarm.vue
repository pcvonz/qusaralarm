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
  </div>
</template>

<script>

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
      if (this.time === alarm.alarm && alarm.armed === true && alarm.days[this.day]) {
        if (typeof cordova !== 'undefined') {
          cordova.plugins.backgroundMode.moveToForeground()
        }
        this.$store.commit('addToProcedureQueue', alarm.procedures)
        this.$store.dispatch('playCurrentUserProcedure', alarm.procedures)
      }
    },
    // doesn't actuallyu do anything
    initAlarm: function (e) {
      // this.$store.dispatch('updateAlarm', {time: e.target.value + ':00', id: this.id})
    },
    updateAlarm: function (e) {
      if (typeof e !== 'undefined') {
        this.$store.dispatch('updateAlarm', {time: e.target.value + ':00', id: this.id})
        this.$emit('updateAlarm', this.alarms[this.id].alarm)
        this.$store.commit('sortProcedureQueue', this.time)
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
    // this.iterateAlarms()
    // setInterval(this.iterateAlarms, 1000)
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
