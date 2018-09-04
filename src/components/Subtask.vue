<template>
  <form @submit.prevent="save()">
    <v-layout row class="row" justify-start>
      <v-checkbox v-if="id" class="checkbox mt-0 mr-3" hide-details v-model="done" v-on:change="save()"></v-checkbox>
      <v-icon class="mr-4" v-if="!id">add</v-icon>
      <v-flex grow>
        <v-text-field @change="save()" tabindex="1" class="disablehotkeys mt-0 mr-3" :placeholder="placeholder" hide-details v-model="title"></v-text-field>
      </v-flex>
      <v-btn icon @click.stop="remove()">
        <v-icon>delete</v-icon>
      </v-btn>
    </v-layout>
  </form>
</template>

<script>
export default {
  name: 'Subtask',
  props: {
    subtask: Object,
  },
  data() {
    return Object.assign({
      id: null,
      title: '',
      done: false,
      removed: false,
    }, this.subtask)
  },
  computed: {
    placeholder() {
      return this.$data.id ? 'Title' : 'New Subtask'
    },
  },
  methods: {
    save() {
      const subtask = this.$data
      if (subtask.id) {
        this.$store.commit('subtasks/update', { subtask })
      } else if (subtask.title) {
        delete subtask.id
        this.$store.commit('subtasks/add', subtask)
        this.title = ''
      }
    },
    remove() {
      this.removed = true
      const subtask = this.$data
      if (this.id) {
        this.$store.commit('subtasks/update', { subtask })
      }
    },
  },
}
</script>

<style scoped>
.row {
  align-items: center;
  overflow-x: hidden;
}

.checkbox {
  flex: 0 1 auto;
  width: auto;
}

.no-padding {
  padding: 0;
}
</style>
