<template>
  <div>
    <div v-for="(proc, index) in procedureObject">
      <div class="item item-link" @click="$refs.procedureModal[index].open()"> {{ proc.name }} </div>
      <q-modal ref="procedureModal">
        <procedure :proc="proc" :pindex="index" :name="proc.name" :options="proc.options"></procedure>
        <button class="item item-link" v-on:click="removeUserProcedure(proc)" @click="$refs.procedureModal[index].close()"> remove </button>
        <button class="item item-link" @click="$refs.procedureModal[index].close()"> CLOSE </button>
      </q-modal>
    </div>
  </div>
</template>

<script>
import Procedure from './Procedure'
export default {
  name: 'user-procedure',
  components: { Procedure },
  props: ['name', 'procedureObject'],
  data () {
    return {
    }
  },
  methods: {
    removeUserProcedure: function (proc) {
      this.$store.dispatch('removeUserProcedure', this.pindex)
    },
    updateProc (e) {
      this.$store.dispatch('updateProc', {pindex: this.pindex, value: e.target.value, index: e.target.dataset.index, key: e.target.dataset.key})
    }
  }
}
</script>

<style></style>
