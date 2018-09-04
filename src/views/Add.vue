<template>
  <form @submit.prevent="addTodo" v-shortkey="['esc']" @shortkey="back()">
    <v-container grid-list-sm class="pa-4">
      <v-text-field autocomplete="off" class="title" v-model="title" name="title" label="Title" autofocus></v-text-field>

      <v-textarea label="Description" v-model="description" name="description" rows="1" auto-grow></v-textarea>

      <v-textarea v-model="subtasks" name="subtasks" label="Subtasks" rows="1" auto-grow prepend-icon="list"></v-textarea>

      <v-select :items="folders" v-model="folder" label="Folder" prepend-icon="folder"></v-select>

      <v-text-field label="Esimated Time (h)" hint="#:## / #.#" v-model="estimatedTime" prepend-icon="timelapse"></v-text-field>

      <v-layout row>
        <v-text-field slot="activator" label="Deadline" v-model="date" prepend-icon="timer" hint="YYYY-mm-dd"></v-text-field>
        <v-text-field slot="activator" label="Time" v-model="time" hint="hh:mm" class="ml-3"></v-text-field>

        <v-dialog ref="dateDialog" persistent v-model="dateModal" lazy width="290px" :return-value.sync="date" @click="dateModal = false">
          <v-date-picker v-model="date" scrollable @input="$refs.dateDialog.save(date)">
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="dateModal = false">Cancel</v-btn>
            <v-btn flat color="primary" @click="$refs.dateDialog.save(date)">OK</v-btn>
          </v-date-picker>
        </v-dialog>

        <v-dialog ref="timeDialog" persistent v-model="timeModal" lazy width="290px" :return-value.sync="time" @click="timeModal = false">
          <v-time-picker v-model="time" scrollable>
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="timeModal = false">Cancel</v-btn>
            <v-btn flat color="primary" @click="$refs.timeDialog.save(time)">OK</v-btn>
          </v-time-picker>
        </v-dialog>
      </v-layout>

      <v-btn flat color="primary" @click="back()">Cancel</v-btn>
      <v-btn flat type="submit">Save</v-btn>
    </v-container>
  </form>
</template>

<script>
export default {
  name: 'add',
  data() {
    return {
      title: '',
      description: '',
      subtasks: '',
      folders: [
        { value: 'inbox', text: 'Inbox' },
        { value: 'today', text: 'Today' },
        { value: 'tomorrow', text: 'Tomorrow' },
        { value: 'next', text: 'Next' },
        { value: 'scheduled', text: 'Scheduled' },
        { value: 'waiting', text: 'Waiting' },
      ],
      folder: 'inbox',
      estimatedTime: null,
      date: null,
      dateModal: false,
      time: null,
      timeModal: false,
      previousRoute: {
        fullPath: '/',
      },
    }
  },
  methods: {
    addTodo() {
      const subtasks = this.$data.subtasks.trim().split('\n')
      this.$store.commit('todos/add', {
        title: this.$data.title.trim(),
        subtasks,
        description: this.$data.description.trim(),
        done: false,
        folder: this.$data.folder,
      })
      this.$store.dispatch('todos/sync')
      this.back()
    },
    back() {
      this.$router.push(this.$data.previousRoute.fullPath)
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$data.previousRoute = from
    })
  },
}
</script>
