<template>
  <div>
    <div v-for="(proc, index) in procedureObject">
      <div class="item item-link" @click="$refs.procedureModal[index].open()"> {{ proc.name }} </div>
      <q-modal ref="procedureModal">
        <procedure :id="id" :proc="proc" :pindex="index" :name="proc.name" :options="proc.options"></procedure>
        <button class="item item-link" v-on:click="removeUserProcedure(index)" @click="$refs.procedureModal[index].close()"> remove </button>
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
  props: ['name', 'procedureObject', 'id'],
  data () {
    return {
    }
  },
  methods: {
    removeUserProcedure: function (index) {
      this.$store.dispatch('removeUserProcedure', {id: this.id, index: index})
    },
    updateProc (e) {
      this.$store.dispatch('updateProc', {id: this.id, pindex: this.pindex, value: e.target.value, index: e.target.dataset.index, key: e.target.dataset.key})
    }
  }
}
</script>

<style></style>
