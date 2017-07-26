<template>
  <div>
    <draggable v-model="procedures">
      <div v-for="(proc, index) in procedures">
        <div class="item item-link" @click="$refs.procedureModal[index].open()"> {{ proc.name }} </div>
        <q-modal ref="procedureModal">
          <procedure :id="id" :proc="proc" :pindex="index" :name="proc.name" :options="proc.options"></procedure>
          <button class="item item-link" v-on:click="removeUserProcedure(index)" @click="$refs.procedureModal[index].close()"> remove </button>
          <button class="item item-link" @click="$refs.procedureModal[index].close()"> CLOSE </button>
        </q-modal>
      </div>
  </draggable>
  </div>
</template>

<script>
import Procedure from './Procedure'
import draggable from 'vuedraggable'

export default {
  name: 'user-procedure',
  components: { Procedure, draggable },
  props: ['name', 'procedureObject', 'id'],
  data () {
    return {
    }
  },
  methods: {
    removeUserProcedure: function (index) {
      this.$store.dispatch('removeUserProcedure', {id: this.id, index: index})
    },
    updateProc: function (e) {
      this.$store.dispatch('updateProc', {id: this.id, pindex: this.pindex, value: e.target.value, index: e.target.dataset.index, key: e.target.dataset.key})
    }
  },
  computed: {
    procedures: {
      get: function () {
        return this.$store.state.alarms[this.id].procedures
      },
      set: function (newVal) {
        this.$store.dispatch('updateProcList', {id: this.id, list: newVal})
      }
    }
  }
}
</script>

<style></style>
