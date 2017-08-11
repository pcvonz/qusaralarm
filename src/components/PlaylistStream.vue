<template>
  <!-- Don't drop "q-app" class -->
  <div>
    <h4> Playlist Steam </h4>
    <div>
      <input v-model:name="name" placeholder="name"/>
    </div>
    <div>
      <input v-model:stream="stream" placeholder="stream"/>
      <input type="file"/> 
    </div>
    <div>
      <input v-model:timeOut="timeOut" placeholder="Time Out"/>
    </div>
    <button v-on:click="createProcedure">Create Procedure</button>
  </div>
</template>

<script>
export default {
  name: 'playlist-stream',
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
      this.$store.commit('createPlaylist', stream)
    }
  }
}
</script>

<style></style>
