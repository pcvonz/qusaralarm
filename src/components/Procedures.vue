<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <ul>
      <li v-for="proc in procedureObject" :proc="proc">
        {{ proc.name }} <br />
        <input v-for="key in Object.keys(proc.options)" :placeholder="proc.options[key]">
        <button v-on:click="addProcedure(proc)">Add this to alarm </button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'procedures',
  data () {
    return {
      procedureObject: this.$store.state.procedures
    }
  },
  methods: {
    addProcedure: function (proc) {
      this.$emit('addProcedure', proc)
    }
  },
  mounted: function () {
    console.log(this.$store.state.procedures)
  }
}
</script>

<style></style>
