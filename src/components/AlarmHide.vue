<template>
  <!-- Don't drop "q-app" class -->
  <div>
    <div v-on:click="changeText"> 
      <q-datetime v-focus v-on:close="updateAlarm" v-if="!textShown" type="time" :value="time" v-model:time="time">
      </q-datetime>
      <p v-if="textShown"> {{ text }} </p>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'alarm-hide',
  props: [ 'text' ],
  data () {
    return {
      textShown: true
    }
  },
  methods: {
    changeText: function (e) {
      if (e.target.tagName === 'P') {
        this.textShown = !this.textShown
      }
    },
    updateAlarm: function (e) {
      console.log('blur')
      this.textShown = !this.textShown
    }
  },
  computed: {
    time: {
      get: function () {
        let formatTime = this.text.split(':')
        let date = moment({'hours': formatTime[0], 'minutes': formatTime[1]})
        console.log(date)
        return date.format()
      },
      set: function (time) {
        let formatTime = moment(time)
        console.log('formatTime')
        formatTime = formatTime.hour() + ':' + formatTime.minute()
        this.textShown = !this.textShown
        this.$emit('updateAlarm', formatTime)
      }
    }
  },
  mounted: function () {
  }
}
</script>

<style lang="scss">
  .isShown {
    display: none !important;
    background-color: rgba(239, 103, 67, 0);
    transition: background-color .2s;
  }
</style>
