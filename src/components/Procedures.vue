<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <ul>
      <li v-for="(proc, index) in procedureObject">
        <procedure v-on:addUserProcedure="addUserProcedure(proc)" :pindex="index" :name="proc.name" :options="proc.options"></procedure>
      </li>
    </ul>
  </div>
</template>

<script>
import Procedure from './Procedure'
export default {
  name: 'procedures',
  components: { Procedure },
  data () {
    return {
      procedureObject: this.$store.state.procedures
    }
  },
  methods: {
    addUserProcedure: function (proc) {
      this.$store.commit('addUserProcedure', proc)
    }
  },
  mounted: function () {
    console.log(this.$store.state.procedures)
  }
}
</script>

<style></style>
