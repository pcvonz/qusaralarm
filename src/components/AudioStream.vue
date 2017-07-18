<template>
  <!-- Don't drop "q-app" class -->
  <div>
		<input v-model:stream="stream" v-on:keyup.enter="fetchData" placeholder="stream"/>
    <button v-on:click="playAudio">Play Audio</button>
  </div>
</template>

<script>
var audio = new Audio()
export default {
  name: 'audio-stream',
  props: ['time', 'alarm'],
  data () {
    return {
      stream: 'https://nprdmp-live01-mp3.akacast.akamaistream.net/7/998/364916/v1/npr.akacast.akamaistream.net/nprdmp_live01_mp3'
    }
  },
  methods: {
    playAudio: function () {
      if (this.time === this.alarm) {
        audio.src = this.stream
        audio.play()
      }
    },
    initAudio: function () {
      setInterval(this.playAudio, 1000)
    }
  },
  mounted: function () {
    this.initAudio()
  }
}
</script>

<style></style>
