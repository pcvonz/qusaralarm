<template>
  <!-- Don't drop "q-app" class -->
  <div>
    <div v-on:click="changeText"> 
      <input :class="{ isShown: textShown}" v-on:blur="changeText" v-model:text="text" type="text"/>
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
