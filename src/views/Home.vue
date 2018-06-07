<template>
  <div class="home" v-shortkey="['a']" @shortkey="goToAdd()">
    <v-subheader>Active ({{ activeTodos.length }})</v-subheader>
    <TodoList :todos="activeTodos"></TodoList>
    <v-subheader>Completed ({{ doneTodos.length }})</v-subheader>
    <TodoList :todos="doneTodos"></TodoList>
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
    activeTodos() {
      return this.$store.getters.activeTodos
    },
    doneTodos() {
      return this.$store.getters.doneTodos
    },
  },
}
</script>
