<template>
  <form v-on:submit="addTodo">
    <v-container grid-list-sm class="pa-4">
      <v-text-field class="title" v-model="title" name="title" label="Title" required></v-text-field>

      <v-text-field label="Description" v-model="description" name="description" multi-line rows="1" auto-grow></v-text-field>

      <v-text-field v-model="subtasks" name="subtasks" label="Subtasks" multi-line rows="1" auto-grow prepend-icon="list"></v-text-field>

      <v-select :items="folders" v-model="folder" label="Folder" prepend-icon="folder"></v-select>

      <v-text-field label="Esimated Time (h)" hint="#:## / #.#" v-model="estimatedTime" prepend-icon="timelapse"></v-text-field>

      <v-dialog ref="dateDialog" persistent v-model="dateModal" lazy width="290px" :return-value.sync="date" @click="dateModal = false">
        <v-text-field slot="activator" label="Deadline" v-model="date" prepend-icon="timer" hint="YYYY-mm-dd"></v-text-field>
        <v-date-picker v-model="date" scrollable @input="$refs.dateDialog.save(date)">
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="dateModal = false">Cancel</v-btn>
          <v-btn flat color="primary" @click="$refs.dateDialog.save(date)">OK</v-btn>
        </v-date-picker>
      </v-dialog>
      <v-dialog ref="timeDialog" persistent v-model="timeModal" lazy width="290px" :return-value.sync="time" @click="timeModal = false">
        <v-text-field slot="activator" label="Time" v-model="time" hint="hh:mm"></v-text-field>
        <v-time-picker v-model="time" scrollable>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="timeModal = false">Cancel</v-btn>
          <v-btn flat color="primary" @click="$refs.timeDialog.save(time)">OK</v-btn>
        </v-time-picker>
      </v-dialog>

      <v-btn flat color="primary" @click="dialog = false">Cancel</v-btn>
      <v-btn flat @click="dialog = false" type="submit">Save</v-btn>
    </v-container>
  </form>
</template>

<script>
export default {
  name: "add",
  data() {
    return {
      title: null,
      description: null,
      subtasks: null,
      folders: [],
      folder: null,
      estimatedTime: null,
      date: null,
      dateModal: false,
      time: null,
      timeModal: false
    };
  },
  methods: {
    addTodo: function(event) {
      event.preventDefault();
      this.$store.commit("addTodo", {
        title: this.$data.title
      });
      this.$router.go("/");
    }
  }
};
</script>
