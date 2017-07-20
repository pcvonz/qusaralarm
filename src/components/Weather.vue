<template>
  <!-- Don't drop "q-app" class -->
  <div>
    <h4> Weather </h4>
    <div>
      <input v-model:name="name" placeholder="name"/>
    </div>
    <div>
      <input v-model:zip="zip" placeholder="zip"/>
    </div>
    <div>
      <input v-model:countryCode="countryCode" placeholder="Country Code"/>
    </div>
    <div>
      <input v-model:unit="unit" placeholder="unit"/>
    </div>
    <button v-on:click="createProcedure">Create Procedure</button>
  </div>
</template>

<script>
export default {
  name: 'weather',
  props: [],
  data () {
    return {
      name: null,
      zip: null,
      countryCode: null,
      unit: null
    }
  },
  methods: {
    createProcedure () {
      let weather = {name: this.name, options: {zip: this.zip, countryCode: this.countryCode, unit: this.unit}}
      this.$store.commit('createWeather', weather)
    }
  }
}
</script>

<style></style>
