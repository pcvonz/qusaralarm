<template>
  <!-- Don't drop "q-app" class -->
  <div>
    {{ name }}
    <input v-model:alarm="alarm" type="time"></input>
    <button v-on:click="initAlarm">Start Alarm</button>
    {{ triggered }}
  </div>
</template>

<script>
export default {
  name: 'alarm',
  props: ['time', 'name', 'procedures'],
  data () {
    return {
      alarm: null,
      triggered: false
    }
  },
  methods: {
    checkAlarm: function () {
      if (this.time === this.alarm) {
        // Add callbacks to each procedure
        // Trigger the next procedure via
        // the callback
        if (this.triggered === false) {
          this.$store.commit('alarmOn')
          if (typeof cordova !== 'undefined') {
            cordova.plugins.backgroundMode.moveToForeground()
          }
          this.$store.state.userProcedures[0].trigger(this.$store.state.userProcedures[0])
          this.triggered = true
        }
      }
      else {
        this.triggered = false
      }
    },
    initAlarm: function () {
      this.checkAlarm()
      setInterval(this.checkAlarm, 1000)
      this.$emit('initAlarm', this.alarm)
    }
  }
}
</script>

<style></style>
