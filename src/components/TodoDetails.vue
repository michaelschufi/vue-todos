<template>
  <div v-shortkey.avoid class="disablehotkeys">
    <span v-shortkey.avoid contenteditable class="disablehotkeys description subheading" @blur="updateDescription($event)">{{ todo.description }}</span>
  </div>
</template>

<script>
export default {
  name: "TodoDetails",
  props: {
    todo: Object
  },
  data() {
    return {
      todoCopy: { id: this.todo.id }
    };
  },
  methods: {
    updateDescription(event) {
      let description = event.target.innerText;
      this.$data.todoCopy.description = description;
      this.saveTodo();
    },
    saveTodo() {
      this.$store.dispatch("updateTodo", this.$data.todoCopy);
    }
  }
};
</script>

<style scoped>
.description {
  display: inline-block;
  min-width: 5em;
  min-height: 1.5em;
  white-space: pre;
}
</style>
