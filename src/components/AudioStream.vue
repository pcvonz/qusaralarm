<template>
  <!-- Don't drop "q-app" class -->
  <div>
    <h4> Audio Steam </h4>
    <div>
      <input v-model:name="name" placeholder="name"/>
    </div>
    <div>
      <input v-model:stream="stream" placeholder="stream"/>
      <input type="file" @change="onFileChange"/> 
    </div>
    <div>
      <input v-model:timeOut="timeOut" placeholder="Time Out"/>
    </div>
    <button v-on:click="createProcedure">Create Procedure</button>
  </div>
</template>

<script>
export default {
  name: 'audio-stream',
  props: [],
  data () {
    return {
      name: null,
      stream: null,
      timeOut: null
    }
  },
  methods: {
    createProcedure () {
      let stream = {name: this.name, options: {stream: this.stream, timeOut: this.timeOut}}
      this.$store.commit('createStream', stream)
    },
    onFileChange (e) {
      this.stream = 'file:///' + e.target.value
    }
  }
}
</script>

<style></style>
