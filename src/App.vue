<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <transition name="slide" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
/*
 * Root component
 */
export default {
  data () {
    return {
    }
  },
  watch: {
    '$route' (to, from) {
      const toId = to.params.id
      const fromId = from.params.id
      this.slide = toId < fromId ? this.slideLeft(to) : this.slideRight(from)
    }
  },
  methods: {
    slideLeft (to) {
      console.log(to)
    },
    slideRight (from) {
      console.log('right')
    }
  }
}
</script>

<style>
.enter-enter-active, .enter-leave-active {
  transition: opacity .3s ease;
}

.enter-enter, .enter-leave-to {
  opacity: 0;
}


</style>
