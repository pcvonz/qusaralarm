<template>
  <!-- Don't drop "q-app" class -->
  <div>
    <h4> Habitica </h4>
    <div>
      <input v-model:name="name" placeholder="name"/>
    </div>
    <div>
      <input v-model:uidKey="uidKey" placeholder="uid key"/>
    </div>
    <div>
      <input v-model:apiKey="apiKey" placeholder="api key"/>
    </div>
    <button v-on:click="createProcedure">Create Procedure</button>
  </div>
</template>

<script>
export default {
  name: 'habitica',
  props: [],
  data () {
    return {
      name: null,
      uidKey: null,
      apiKey: null
    }
  },
  methods: {
    createProcedure () {
      let habitica = {name: this.name, options: {uidKey: this.uidKey, apiKey: this.apiKey}}
      this.$store.commit('createHabitica', habitica)
    }
  }
}
</script>

<style></style>
