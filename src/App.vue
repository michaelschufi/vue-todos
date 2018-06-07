<template>
  <v-app id="inspire">
    <v-navigation-drawer fixed :clipped="$vuetify.breakpoint.lgAndUp" app v-model="drawer">
    </v-navigation-drawer>
    <v-toolbar color="blue darken-3" dark app :clipped-left="$vuetify.breakpoint.lgAndUp" fixed>
      <v-toolbar-title class="toolbar-title ml-0 pl-3">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <span>{{title}}</span>
      </v-toolbar-title>
      <v-text-field flat solo-inverted prepend-icon="search" label="Search"></v-text-field>
      <v-spacer class="hidden-sm-and-down"></v-spacer>
      <v-btn @click="init" icon large>
        <v-icon>sync</v-icon>
      </v-btn>
      <v-btn icon large>
        <v-avatar size="32px" tile>
          <img src="https://vuetifyjs.com/static/doc-images/logo.svg" alt="Vuetify">
        </v-avatar>
      </v-btn>
    </v-toolbar>
    <v-content fluid>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
export default {
  created() {
    this.init()
  },
  data() {
    return {
      dialog: false,
      drawer: null,
    }
  },
  computed: {
    title() {
      return this.$route.name
    },
  },
  methods: {
    init() {
      this.$store.dispatch('loadTodos')
      this.$store.dispatch('loadSubtasks')
    },
  },
}
</script>

<style scoped>
.toolbar-title {
  width: 300px;
  display: flex;
  align-items: center;
}
</style>
