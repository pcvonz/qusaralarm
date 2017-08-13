<template>
  <div>
    <div class="userProcedures" v-for="(proc, index) in procedureObject">
      <q-collapsible ref="procedureModal" :label="proc.name">
        <procedure v-on:updateProc="updateProc" :proc="proc" :pindex="index" :name="proc.name" :options="proc.options"></procedure>
        <button v-on:click="testProcedure(proc)" >Test Alarm</button>
        <button v-on:click="removeProcedure(index)">Remove </button>
      </q-collapsible>
        <div class="addToAlarm"> <button v-on:click="addUserProcedure(proc)"><i> add </i></button> </div>
    </div>
  </div>
</template>

<script>
import Procedure from './Procedure'
import { Toast } from 'quasar'
export default {
  name: 'procedures',
  components: { Procedure, Toast },
  props: ['procedureObject', 'id'],
  data () {
    return {
    }
  },
  methods: {
    addUserProcedure: function (proc) {
      console.log(this.id)
      Toast.create(`Added ${proc.name} to ${this.$store.state.alarms[this.id].title}`)
      this.$store.dispatch('addUserProcedure', {procedure: proc, id: this.id})
    },
    removeProcedure: function (index) {
      this.$store.dispatch('removeProcedure', index)
    },
    updateProc (e) {
      console.log(e.target.dataset)
      this.$store.dispatch('updateProc', {pindex: e.target.dataset.index, value: e.target.value, key: e.target.dataset.key})
    },
    testProcedure (proc) {
      proc.trigger()
    }
  }
}
</script>

<style>
.q-collapsible {
  width: 80%;
}
.addToAlarm {
  width: 20%;
}
.userProcedures {
  margin-top: .2em;
  display: flex;
}
</style>
