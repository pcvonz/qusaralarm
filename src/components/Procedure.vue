<template>
  <!-- Don't drop "q-app" class -->
  <div>
    <input v-for="(key, index) in Object.keys(options)" :value="options[key]" :data-index="pindex" :data-key="key" @input="updateProc" :placeholder="options[key]">
  </div>
</template>

<script>
export default {
  name: 'procedure',
  props: ['name', 'options', 'proc', 'pindex'],
  data () {
    return {
    }
  },
  methods: {
    updateProc (e) {
      this.$emit('updateProc', e)
    }
  }
}
</script>

<style>
</style>
