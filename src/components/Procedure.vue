<template>
  <!-- Don't drop "q-app" class -->
  <div>
    <input v-for="(key, index) in Object.keys(options)" :value="options[key]" :data-index="index" :data-key="key" @input="updateProc" :placeholder="options[key]">
  </div>
</template>

<script>
export default {
  name: 'procedure',
  props: ['name', 'options', 'pindex', 'proc'],
  data () {
    return {
    }
  },
  methods: {
    updateProc (e) {
      this.$emit('updateProc', this.proc)
    }
  }
}
</script>

<style></style>
