<template>
  <div v-shortkey.avoid class="disablehotkeys">
    <v-text-field placeholder="<no description>" class="pa-0" auto-grow rows="1" v-model="todoCopy.description" hide-details full-width textarea @blur="saveTodo()"></v-text-field>
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
      this.saveTodo()
    },
    saveTodo() {
      this.$store.dispatch('updateTodo', this.$data.todoCopy)
    },
  },
  watch: {
    todo() {
      this.$data.todoCopy = Object.assign(this.todoCopy, this.todo)
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
}
</style>
