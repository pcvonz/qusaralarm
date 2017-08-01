<template>
  <div>
    <div v-for="(proc, index) in procedureObject">
      <div class="item item-link" @click="$refs.procedureModal[index].open()"> {{ proc.name }} </div>
      <q-modal ref="procedureModal">
        <procedure :proc="proc" :pindex="index" :name="proc.name" :options="proc.options"></procedure>
        <button class="item item-link" @click="$refs.procedureModal[index].close()"> CLOSE </button>
        <button v-on:click="testProcedure(proc)" >Test Alarm</button>
        <button v-on:click="addUserProcedure(proc)" @click="$refs.procedureModal[index].close()">Add this to alarm </button>
        <button v-on:click="removeProcedure(index)" @click="$refs.procedureModal[index].close()">Remove </button>
      </q-modal>
    </div>
  </div>
</template>

<script>
import Procedure from './Procedure'
export default {
  name: 'procedures',
  components: { Procedure },
  props: ['procedureObject', 'id'],
  data () {
    return {
    }
  },
  methods: {
    addUserProcedure: function (proc) {
      console.log(this.id)
      this.$store.dispatch('addUserProcedure', {procedure: proc, id: this.id})
    },
    removeProcedure: function (index) {
      this.$store.dispatch('removeProcedure', index)
    },
    updateProc (e) {
      this.$store.dispatch('updateProc', {pindex: this.pindex, value: e.target.value, index: e.target.dataset.index, key: e.target.dataset.key})
    },
    testProcedure (proc) {
      proc.trigger()
    }
  }
}
</script>

<style>
</style>
