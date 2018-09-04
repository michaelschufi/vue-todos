<template>
  <v-app id="inspire">
    <v-navigation-drawer fixed :clipped="$vuetify.breakpoint.lgAndUp" app v-model="drawer">
      <Menu></Menu>
    </v-navigation-drawer>
    <v-toolbar color="blue darken-3" dark app :clipped-left="$vuetify.breakpoint.lgAndUp" fixed>
      <v-toolbar-title class="toolbar-title ml-0 pl-3">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <span>{{title}}</span>
      </v-toolbar-title>
      <v-text-field flat solo-inverted prepend-icon="search" label="Search"></v-text-field>
      <v-spacer class="hidden-sm-and-down"></v-spacer>
      <v-btn :class="{syncing: syncing}" @click="sync" icon large>
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
import Menu from '@/components/Menu.vue'

export default {
  components: {
    Menu,
  },
  created() {
    this.sync()
  },
  data() {
    return {
      dialog: false,
      drawer: null,
    }
  },
  computed: {
    title() {
      return this.$route.meta.title || this.$store.state.pageTitle
    },
    syncing() {
      return this.$store.state.todos.syncing
    },
  },
  methods: {
    sync() {
      this.$store.dispatch('todos/sync')
      this.$store.dispatch('subtasks/sync')
    },
  },
}
</script>

<style scoped>
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(-360deg);
  }
}

.toolbar-title {
  width: 300px;
  display: flex;
  align-items: center;
}

.syncing {
  animation: 1.2s linear rotate infinite;
}
</style>
