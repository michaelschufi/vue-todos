<template>
  <div>
    <span v-shortkey.avoid contenteditable class="disablehotkeys description subheading" @input="updateDescription($event)" @blur="saveTodo()" tabindex="0">{{ todo.description || "no description" }}</span>
    <!--<v-text-field v-shortkey.avoid :tabindex="todo.id" placeholder="<no description>" class="pa-0" auto-grow rows="1" v-model="todoCopy.description" hide-details full-width textarea @blur="saveTodo()"></v-text-field>-->
    <br>
    <br>
    <h4>Subtasks</h4>
    <Subtasks :todoId="todo.id" />
  </div>
</template>

<script>
import Subtasks from '@/components/Subtasks.vue'

export default {
  name: 'TodoDetails',
  components: {
    Subtasks,
  },
  props: {
    todo: Object,
  },
  data() {
    return {
      todoCopy: Object.assign({}, this.todo),
    }
  },
  methods: {
    updateDescription(event) {
      const description = event.target.innerText
      this.$data.todoCopy.description = description
    },
    saveTodo() {
      this.$data.todoCopy.dirty = true
      this.$store.commit('todos/update', { todo: this.$data.todoCopy, id: this.$data.todoCopy.id })
      this.$store.dispatch('todos/sync')
    },
  },
  watch: {
    todo() {
      this.$data.todoCopy = Object.assign(this.$data.todoCopy, this.todo)
    },
  },
}
</script>

<style scoped>
.description {
  display: inline-block;
  min-width: 5em;
  min-height: 1.5em;
  white-space: pre;
  width: 100%;
}
</style>
