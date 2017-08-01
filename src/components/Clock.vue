<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    {{ time }}
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'clock',
  data () {
    return {
      time: null,
      day: null
    }
  },
  methods: {
    updateTime: function () {
      this.time = moment().format('HH:mm:ss')
      this.day = moment().format('dddd')
      this.$emit('updateTime', this.time, this.day)
    }
  },
  mounted: function () {
    this.updateTime()
    setInterval(this.updateTime, 1000)
  }
}
</script>

<style></style>
