<template>
  <div>
    <v-layout row class="row" justify-start>
          <v-checkbox class="checkbox mr-4" hide-details v-model="subtask.done" v-on:change="setDone(todo.id, todo.done)"></v-checkbox>
          <v-flex grow>
            <v-text-field class="no-padding" placeholder="Title" hide-details v-model="subtask.title"></v-text-field>
          </v-flex>
          <v-btn icon @click.stop="remove(todo.id)">
            <v-icon>delete</v-icon>
          </v-btn>
        </v-layout>
  </div>
</template>

<script>
export default {
  props: {
    subtask: Object
  },
  data() {
    return {};
  }
};
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

