<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    {{ name }} <br />
    <input v-for="(key, index) in Object.keys(options)" :value="options[key]" :data-index="index" :data-key="key" @input="updateProc" :placeholder="options[key]">
    <button v-on:click="addUserProcedure()">Add this to alarm </button>
    <button v-on:click="removeProcedure()">Remove </button>
  </div>
</template>

<script>
export default {
  name: 'procedure',
  props: ['name', 'options', 'pindex'],
  data () {
    return {
    }
  },
  methods: {
    addUserProcedure: function (proc) {
      this.$emit('addUserProcedure', proc)
    },
    removeProcedure: function (proc) {
      this.$store.dispatch('removeProcedure', this.pindex)
    },
    updateProc (e) {
      this.$store.dispatch('updateProc', {pindex: this.pindex, value: e.target.value, index: e.target.dataset.index, key: e.target.dataset.key})
    }
  }
}
</script>

<style></style>
