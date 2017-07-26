<template>
  <!-- Don't drop "q-app" class -->
  <div>
    {{ name }}
    <input @input="updateAlarm" v-on:keyup.enter="initAlarm" type="time">
    <q-toggle :value="value" @input="alarmToggle"></q-toggle>
  </div>
</template>

<script>
export default {
  name: 'alarm',
  props: ['time', 'name', 'procedures', 'id'],
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
    checkAlarm: function (alarm) {
      if (this.time === alarm.alarm && alarm.armed === true) {
        if (typeof cordova !== 'undefined') {
          cordova.plugins.backgroundMode.moveToForeground()
        }
        this.$store.commit('addToProcedureQueue', alarm.procedures)
        this.$store.dispatch('playCurrentUserProcedure', alarm.procedures)
      }
    },
    initAlarm: function (e) {
      // this.$store.dispatch('updateAlarm', {time: e.target.value + ':00', id: this.id})
    },
    updateAlarm: function (e) {
      console.log('hello')
      if (typeof e !== 'undefined') {
        this.$store.dispatch('updateAlarm', {time: e.target.value + ':00', id: this.id})
        this.$emit('initAlarm', this.alarms[this.id].alarm)
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
    this.initAlarm()
    this.iterateAlarms()
    setInterval(this.iterateAlarms, 1000)
  }
}
</script>

<style></style>
