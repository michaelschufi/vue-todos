<template>
  <div>
    <v-layout row class="row" justify-start>
      <v-checkbox v-if="id" class="checkbox mr-4" hide-details v-model="done" v-on:change="save()"></v-checkbox>
      <v-icon class="mr-4" v-if="!id">add</v-icon>
      <v-flex grow>
        <v-text-field :disabled="done" @keyup.enter="save()" class="disablehotkeys no-padding" :placeholder="placeholder" hide-details v-model="title"></v-text-field>
      </v-flex>
      <v-btn icon :disabled="!id || done" @click.stop="remove(id)">
        <v-icon v-if="id">delete</v-icon>
      </v-btn>
    </v-layout>
  </div>
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
    }, this.subtask)
  },
  computed: {
    placeholder() {
      return this.$data.id ? 'Title' : 'New Subtask'
    },
  },
  methods: {
    remove(id) {
      this.$store.dispatch('removeSubtask', id)
    },
    save() {
      const subtask = Object.assign({}, this.$data)
      if (subtask.id) {
        this.$store.dispatch('updateSubtask', subtask)
      } else {
        this.$store.dispatch('addSubtask', subtask)
        this.$data.title = ''
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
