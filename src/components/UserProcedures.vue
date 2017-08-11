<template>
  <div id="userProcedures">
    <draggable v-model="procedures">
      <div class="procedure" v-for="(proc, index) in procedures">
        <div class="item item-link" @click="$refs.procedureModal[index].open()"> <p>{{ proc.name }} </p></div>
        <q-modal ref="procedureModal">
          <input-hide :text="proc.name"> </input-hide>
          <procedure v-on:updateProc="updateProc" :id="id" :proc="proc" :pindex="index" :name="proc.name" :options="proc.options"></procedure>
          <button class="item item-link" v-on:click="removeUserProcedure(index)" @click="$refs.procedureModal[index].close()"> remove </button>
          <button class="item item-link" @click="$refs.procedureModal[index].close()"> CLOSE </button>
        </q-modal>
      </div>
  </draggable>
  </div>
</template>

<script>
import Procedure from './Procedure'
import draggable from 'vuedraggable'
import InputHide from './InputHide'

export default {
  name: 'user-procedure',
  components: { Procedure, draggable, InputHide },
  props: ['name', 'procedureObject', 'id'],
  data () {
    return {
    }
  },
  methods: {
    removeUserProcedure: function (index) {
      this.$store.dispatch('removeUserProcedure', {id: this.id, index: index})
    },
    updateProc: function (e) {
      console.log(e)
      this.$store.dispatch('updateUserProc', {id: this.id, pindex: e.target.dataset.index, value: e.target.value, key: e.target.dataset.key})
    }
  },
  computed: {
    procedures: {
      get: function () {
        return this.$store.state.alarms[this.id].procedures
      },
      set: function (newVal) {
        this.$store.dispatch('updateProcList', {id: this.id, list: newVal})
      }
    }
  }
}
</script>

<style lang="scss">
#userProcedures {
  display: flex;
  justify-content: center;

}
.procedure {
  background-color: white;
  width: 10em;
  text-align: center;
  .item {
    margin: .3em 0 0 0;
    display: flex;
    justify-content: center;
    align-items: center;
    p {
      padding: 0;
      margin: 0;
    }
  }
}
.modal {
  p {
    color: black;
  }
}
.item-link {
  p {
    color: black;
  }
}
</style>
