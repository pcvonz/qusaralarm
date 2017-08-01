<template>
  <!-- Don't drop "q-app" class -->
  <div>
    <input v-for="(key, index) in Object.keys(options)" :value="options[key]" :data-index="index" :data-key="key" @input="updateUserProc" :placeholder="options[key]">
    <button v-on:click="removeProcedure()" @click="$refs.procedureModal.close()">Remove </button>
    <button class="primary" @click="$refs.procedureModal.close()">Close</button>
  </div>
</template>

<script>
export default {
  name: 'user-procedure',
  props: ['name', 'options', 'pindex'],
  data () {
    return {
    }
  },
  methods: {
    removeProcedure: function (proc) {
      this.$store.dispatch('removeUserProcedure', this.pindex)
    },
    updateUserProc (e) {
      console.log(e)
      this.$store.dispatch('updateUserProc', {pindex: this.pindex, value: e.target.value, index: e.target.dataset.index, key: e.target.dataset.key})
    }
  }
}
</script>

<style>
</style>
