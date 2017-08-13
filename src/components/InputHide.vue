<template>
  <!-- Don't drop "q-app" class -->
  <div>
    <div v-on:click="changeText"> 
      <input class="changeTextInput" v-focus v-if="!textShown" v-on:blur="textShown = !textShown" v-model:setText="setText" type="text"/>
      <p :class="{ isShown: !textShown}"> {{ text }} </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'input-hide',
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
        console.log(e)
      }
      else {
        console.log('else')
        e.target.focus()
      }
    }
  },
  computed: {
    setText: {
      get: function () {
        return this.text
      },
      set: function (newTitle) {
        console.log(newTitle)
        this.$emit('updateTitle', newTitle)
      }
    }
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
.changeTextInput {
  color: white;
}
</style>

