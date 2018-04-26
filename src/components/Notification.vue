<template>
  <v-snackbar
        v-model="snackbar"
      >
        {{ text }}
        <v-btn flat color="primary" @click.native="snackbar = false">Close</v-btn>
      </v-snackbar>
</template>
<script>
export default {
  data() {
    return {
      snackbar: $this.store.state.showNotification,
      text: $this.store.state.notificationText
    }
  }
}
</script>