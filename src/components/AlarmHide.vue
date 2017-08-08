<template>
  <!-- Don't drop "q-app" class -->
  <div>
    <div v-on:click="changeText"> 
      <input v-focus v-if="!textShown" @input="updateAlarm" v-on:blur="updateAlarm" type="time" autofocus/>
      <p v-if="textShown"> {{ text }} </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'alarm-hide',
  props: [ 'text' ],
  data () {
    return {
      textShown: true
    }
  },
  methods: {
    changeText: function (e) {
      if (e.target.tagName === 'P' || e.target.tagName === 'DIV') {
        this.textShown = !this.textShown
      }
      else {
        e.target.focus()
      }
    },
    updateAlarm: function (e) {
      this.$emit('updateAlarm', e)
      this.textShown = !this.textShown
    }
  },
  computed: {
  },
  mounted: function () {
  }
}
</script>

<style lang="scss">
  .isShown {
    display: none !important;
    background-color: rgba(239, 103, 67, 0);
    transition: background-color .2s;
  }
</style>
