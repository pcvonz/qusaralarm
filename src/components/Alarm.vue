<template>
  <!-- Don't drop "q-app" class -->
  <div id="alarmSettings">
    <div id="setAlarm">
      <alarm-hide v-on:updateAlarm="updateAlarm"  :text="alarms[id].alarm">
      </alarm-hide>
      <q-toggle :value="value" @input="alarmToggle"></q-toggle>
    </div>
    <div id="days">
      <label class="dayRadio" v-for="key in Object.keys(alarms[this.id].days)">
        <!--q-checkbox :value="alarms[id].days[key]" @input="updateDay(key)"></q-checkbox-->
        <input :value="alarms[id].days[key]" @input="updateDay(key)" type="checkbox"> </input>
        <div>         
          <p>{{ key.slice(0, 2) }}</p>
        </div>

      </label>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import AlarmHide from './AlarmHide'
export default {
  name: 'alarm',
  props: ['day', 'time', 'name', 'procedures', 'id'],
  components: { AlarmHide },
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
        this.$emit('triggerAlarm')
      }
    },
    // doesn't actually do anything
    initAlarm: function (e) {
      // this.$store.dispatch('updateAlarm', {time: e.target.value + ':00', id: this.id})
    },
    updateAlarm: function (e) {
      if (typeof e !== 'undefined') {
        this.$store.dispatch('updateAlarm', {time: e + ':00', id: this.id})
        let alarmTime = this.$store.state.alarms[this.id].alarm.split(':')
        let notify = moment().hours(alarmTime[0]).minutes(alarmTime[1]).seconds('00')
        if (moment().diff(notify) < 0) {
          notify.add(1, 'day')
        }
        this.$emit('updateAlarm', alarmTime)
        this.$store.commit('sortProcedureQueue', this.time)
        console.log('updating alarm')
        if (typeof cordova !== 'undefined') {
          // TODO: Move background plugin defaults to separate function
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

<style lang="scss">
.dayRadio {
  input {
    display: none;
  }
  input:checked + div {
    background-color: #478cbf;
    p {
      color: white;
    }
  }
  div {
    background-color: white;
    width: 30px;
    height: 30px;
    margin: .2em;
    border: 2px solid white;
    display: flex;
    justify-content: center;
    p {
      color: #478cbf;
    }
    transition: background-color .2s, color .2s
  }
}
#days {
  display: flex;
  padding: .3em 0 .3em 0;
  background-color: #478CBF;
  justify-content: center;
}
.q-toggle input:checked + div::after {
  background: #ca4949;
}
#setAlarm {
  display: flex;
  justify-content: center;
  &>* {
    margin: 0 .5em 0 .5em;
  }
}
</style>
