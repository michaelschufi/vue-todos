<template>
  <div v-shortkey.avoid class="disablehotkeys">
    <span v-shortkey.avoid contenteditable class="disablehotkeys description subheading" @blur="updateDescription($event)">{{ todo.description }}</span>
    <br><br>
    <h4>Subtasks</h4>
    <Subtasks :todoId="todo.id" />
  </div>
</template>

<script>
import Subtasks from "@/components/Subtasks.vue";

export default {
  name: "TodoDetails",
  components: {
    Subtasks
  },
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
