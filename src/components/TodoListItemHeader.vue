<template>
  <v-layout row class="row" justify-start>
    <v-checkbox class="checkbox mr-3 my-0" hide-details v-model="todoCopy.done" v-on:change="saveTodo()"></v-checkbox>
    <v-flex grow>
      <span @click.stop @blur="updateTitle($event)" :contenteditable="isActive" class="subheading disablehotkeys">{{ todoCopy.title }}</span>
      <span class="body-1 grey--text grey--darken-2" v-if="!isActive"><br>{{ todoCopy.description }}</span>
    </v-flex>
    <v-btn icon clickable @click="removeTodo()">
      <v-icon>delete</v-icon>
    </v-btn>
  </v-layout>
</template>

<script>
export default {
  name: 'TodoListItemHeader',
  props: {
    todo: Object,
    isActive: Boolean,
  },
  data() {
    return {
      todoCopy: Object.assign({}, this.todo),
    }
  },
  methods: {
    updateTitle(event) {
      const title = event.target.innerText
      this.$data.todoCopy.title = title
      this.saveTodo()
    },
    saveTodo() {
      this.$data.todoCopy.dirty = true
      this.$store.commit('todos/update', { todo: this.$data.todoCopy, id: this.$data.todoCopy.id })
      this.$store.dispatch('todos/sync')
    },
    removeTodo() {
      this.$store.commit('todos/update', {
        todo: { removed: true },
        id: this.$data.todoCopy.id,
      })
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
.row {
  align-items: center;
}

.checkbox {
  flex: 0 1 auto;
  width: auto;
}
</style>
