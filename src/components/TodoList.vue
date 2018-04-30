<template>
  <v-list>
    <v-list-tile v-for="(todo, index) in todos" :key="index">
      <v-list-tile-action>
        <v-checkbox v-model="todo.done" v-on:change="setDone(index, todo.done)"></v-checkbox>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>{{ todo.title }}</v-list-tile-title>
        <v-list-tile-sub-title>{{todo.description}}</v-list-tile-sub-title>
      </v-list-tile-content>
      <v-list-tile-action @click="remove(index)">
        <v-btn icon>
          <v-icon>delete</v-icon>
        </v-btn>
      </v-list-tile-action>
    </v-list-tile>
  </v-list>
</template>

<script>
export default {
  name: "TodoList",
  props: {
    todos: Array
  },
  methods: {
    setDone(index, done) {
      this.$store.commit("setTodoDone", { index, done });
    },
    remove(index) {
      this.$store.dispatch("removeTodo", index);
    }
  }
};
</script>
