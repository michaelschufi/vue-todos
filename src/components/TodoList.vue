<template>
  <v-expansion-panel inset>
    <v-expansion-panel-content hide-actions v-for="(todo, index) in todos" :key="todo.id" :class="getClass(index)" @input="setActive(index, $event)">
      <div slot="header">
        <v-layout row class="row" justify-start>
          <v-checkbox class="checkbox mr-4" hide-details v-model="todo.done" v-on:change="setDone(todo.id, todo.done)"></v-checkbox>
          <v-flex grow>
            <span @click.stop @blur="updateTitle($event, todo.id)" :contenteditable="editable(index)" class="subheading">{{ todo.title }}</span>
            <span class="body-1 grey--text grey--darken-2" v-if="activePanel != index"><br>{{ todo.description }}</span>
          </v-flex>
          <v-btn icon @click.stop="remove(todo.id)">
            <v-icon>delete</v-icon>
          </v-btn>
        </v-layout>
      </div>
      <div class="content pa-3">
        <TodoDetails :todo="todo" />
      </div>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import TodoDetails from '@/components/TodoDetails.vue'

export default {
  name: 'TodoList',
  components: { TodoDetails },
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
    editable(index) {
      return this.$data.activePanel === index
    },
    updateTitle(event, id) {
      const title = event.target.innerText
      this.$store.dispatch('updateTodo', {
        id,
        title,
      })
    },
    setDone(id, done) {
      this.$store.dispatch('updateTodo', {
        id,
        done,
      })
    },
    remove(id) {
      this.$store.dispatch('removeTodo', id)
    },
    setEditing(editing) {
      this.$store.commit('setEditing', editing)
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
.expansion-panel__container:not(.expansion-panel__container--active) {
  max-width: 100% !important;
  border: none !important;
}

.expansion-panel__header {
  padding: 12px !important;
  height: 48px;
}

.expansion-panel__container:first-child:not(.expansion-panel__container--active) {
  padding-top: 8px;
}

.expansion-panel__container:last-child:not(.expansion-panel__container--active) {
  padding-bottom: 8px;
}

.show-newline {
  white-space: pre;
}
</style>

<style scoped>
.row {
  align-items: center;
  overflow-x: hidden;
}

.checkbox {
  flex: 0 1 auto;
  width: auto;
}
</style>
