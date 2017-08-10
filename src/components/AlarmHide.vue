<template>
  <!-- Don't drop "q-app" class -->
  <div>
    <div> 
      <q-datetime type="time" :value="time" v-model:time="time">
      </q-datetime>
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
    }
  },
  methods: {
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
.q-picker-textfield.active .q-picker-textfield-value {
  color: white;
  text-align: center;
}

.q-picker-textfield::before{
  
}

.q-picker-textfield::after {
  display: none;
}
</style>
