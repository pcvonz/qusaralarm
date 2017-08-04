<template>
  <!-- Don't drop "q-app" class -->
  <div>
    <h1 id="time"> {{ time }} </h1>
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

<style lang="scss">
#time {
 color: white;
}
</style>
