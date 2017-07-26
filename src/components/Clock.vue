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
      time: null
    }
  },
  methods: {
    updateTime: function () {
      this.time = moment().format('HH:mm:ss')
      this.$emit('updateTime', this.time)
    }
  },
  mounted: function () {
    this.updateTime()
    setInterval(this.updateTime, 1000)
  }
}
</script>

<style></style>
