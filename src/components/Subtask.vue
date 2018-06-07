<template>
  <div>
    <v-layout row class="row" justify-start>
      <v-checkbox v-if="subtaskCopy.id" class="checkbox mr-4" hide-details v-model="subtaskCopy.done" v-on:change="setDone(subtaskCopy.id, subtaskCopy.done)"></v-checkbox>
      <v-icon class="mr-4" v-if="!subtaskCopy.id">add</v-icon>
      <v-flex grow>
        <v-text-field class="no-padding" :placeholder="placeholder" hide-details v-model="subtaskCopy.title"></v-text-field>
      </v-flex>
      <v-btn icon @click.stop="remove(subtaskCopy.id)">
        <v-icon>delete</v-icon>
      </v-btn>
    </v-layout>
  </div>
</template>

<script>
export default {
  props: {
    todoId: String,
    subtask: Object,
  },
  data() {
    return {
      subtaskCopy: Object.assign({}, this.subtask),
    }
  },
  computed: {
    placeholder() {
      return this.$data.subtaskCopy.id ? 'Title' : 'New Subtask'
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
