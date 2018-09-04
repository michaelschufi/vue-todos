<template>
  <div class="home" v-shortkey="['a']" @shortkey="goToAdd()">
    <div v-for="(todoList, index) in todoLists" :key="index">
      <v-subheader>{{ todoList.folder.text }} ({{ todoList.todos.length }})</v-subheader>
      <TodoList :todos="todoList.todos"></TodoList>
    </div>
    <router-link to="/add">
      <v-btn fab bottom right color="pink" dark fixed>
        <v-icon>add</v-icon>
      </v-btn>
    </router-link>
  </div>
</template>

<script>
// @ is an alias to /src
import TodoList from '@/components/TodoList.vue'
import constants from '@/constants'

export default {
  components: {
    TodoList,
  },
  methods: {
    goToAdd() {
      this.$router.push('/add')
    },
  },
  computed: {
    todoLists() {
      return constants.folders.map(folder => ({
        folder,
        todos: this.$store.getters['todos/byFolder'](folder.value),
      }))
    },
  },
}
</script>
