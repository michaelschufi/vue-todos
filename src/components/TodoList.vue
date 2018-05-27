<template>
  <v-expansion-panel inset>
    <v-expansion-panel-content hide-actions v-for="(todo, index) in todos" :key="index" :class="getClass(index)" @input="setActive(index, $event)">
      <div slot="header">
        <v-layout row class="row" justify-start>
          <v-checkbox class="checkbox mr-4" hide-details v-model="todo.done" @click.stop="null" v-on:change="setDone(index, todo.done)"></v-checkbox>
          <v-flex grow>
            <span class="subheading">{{ todo.title }}</span>
            <span class="body-1 grey--text grey--darken-2" v-if="activePanel != index"><br>{{ todo.description }}</span>
          </v-flex>
          <v-btn icon @click="remove(index)">
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
import TodoDetails from "@/components/TodoDetails.vue";

export default {
  name: "TodoList",
  components: { TodoDetails },
  props: {
    todos: Array
  },
  data() {
    return {
      activePanel: null
    };
  },
  methods: {
    setDone(index, done) {
      this.$store.commit("setTodoDone", { index, done });
    },
    remove(index) {
      this.$store.dispatch("removeTodo", index);
    },
    setEditing(editing) {
      this.$store.commit("setEditing", editing);
    },
    setActive(index, active) {
      this.$data.activePanel = active ? index : null;
    },
    getClass(index) {
      if (index + 1 === this.$data.activePanel) {
        return "prev pb-2";
      } else if (index - 1 === this.$data.activePanel) {
        return "next pt-2";
      } else {
        return "";
      }
    }
  }
};
</script>

<style>
.expansion-panel__container:not(.expansion-panel__container--active) {
  max-width: 100% !important;
  border: none !important;
}

.expansion-panel__header {
  padding: 12px;
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
