<template>
  <v-expansion-panel inset>
    <v-expansion-panel-content hide-actions v-for="(todo, index) in todos" :key="todo.id" :class="getClass(index)" @input="setActive(index, $event)">
      <div slot="header">
        <TodoListItemHeader :todo="todo" :isActive="isActive(index)" />
      </div>
      <div class="content pa-3">
        <TodoDetails :todo="todo" />
      </div>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import TodoListItemHeader from '@/components/TodoListItemHeader.vue'
import TodoDetails from '@/components/TodoDetails.vue'

export default {
  name: 'TodoList',
  components: { TodoListItemHeader, TodoDetails },
  props: {
    todos: Array,
  },
  data() {
    return {
      activePanel: null,
      currentTitle: null,
    }
  },
  methods: {
    isActive(index) {
      return this.$data.activePanel === index
    },
    setDone(id, done) {
      const todo = Object.assign({ dirty: true }, { done })
      this.$store.commit('todos/update', {
        todo,
        id,
      })
      this.$store.dispatch('todos/sync')
    },
    setActive(index, active) {
      this.$data.activePanel = active ? index : null
    },
    getClass(index) {
      if (index + 1 === this.$data.activePanel) {
        return 'prev pb-2'
      } else if (index - 1 === this.$data.activePanel) {
        return 'next pt-2'
      }
      return ''
    },
  },
}
</script>

<style>
.v-expansion-panel__container:not(.v-expansion-panel__container--active) {
  max-width: 100% !important;
  border: none !important;
}

.v-expansion-panel__container:first-child:not(.v-expansion-panel__container--active) {
  padding-top: 8px;
}

.v-expansion-panel__container:last-child:not(.v-expansion-panel__container--active) {
  padding-bottom: 8px;
}
</style>
