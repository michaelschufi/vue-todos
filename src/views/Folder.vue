<template>
  <div>
    <v-subheader>{{ folder.text }} ({{ todos.length }})</v-subheader>
    <TodoList :todos="todos"></TodoList>
  </div>
</template>

<script>
import TodoList from '@/components/TodoList.vue'
import constants from '../constants'

export default {
  components: {
    TodoList,
  },
  computed: {
    folder() {
      return constants.folders.find(folder => folder.value === this.$store.state.route.params.folder)
    },
    todos() {
      return this.$store.getters['todos/byFolder'](this.folder.value)
    },
  },
}
</script>
