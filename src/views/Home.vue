<template>
  <div class="home">
    <img src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <router-link to="/add">
      <v-btn fab bottom right color="pink" dark fixed>
        <v-icon>add</v-icon>
      </v-btn>
    </router-link>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "home",
  components: {
    HelloWorld
  }
};
</script>
