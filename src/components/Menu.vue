<template>
  <div>
    <v-list dense>
    <v-list-tile @click="navigateHome()">
      <v-list-tile-action>
        <v-icon>home</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>Home</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
  </v-list>
  <v-divider></v-divider>
  <v-list dense subheader>
    <v-subheader>Folders</v-subheader>
    <v-list-tile v-for="(folder, index) in folders" :key="index" @click="navigate(folder)">
      <v-list-tile-action>
        <v-icon>{{ folder.icon }}</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>{{ folder.text }}</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
  </v-list>
  </div>
</template>

<script>
import constants from '../constants'

export default {
  data() {
    return {
      folders: Object.assign({}, constants.folders),
    }
  },
  methods: {
    navigateHome() {
      this.$router.push('/')
    },
    navigate(folder) {
      this.$router.push(`/${folder.value}`)
    },
  },
}
</script>
