<template>
  <div class="disablehotkeys">
    <span contenteditable class="disablehotkeys description subheading" @input="updateDescription($event)" @blur="saveTodo()" auto-grow multi-line hide-details rows="1">{{ todo.description }}</span>
    <!-- <v-text-field class="description" auto-grow multi-line hide-details rows="1" v-model="todo.description"/> -->
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
      updatedTodo: Object.assign({}, this.todo)
    };
  },
  methods: {
    updateDescription(event) {
      this.$data.updatedTodo.description = event.target.innerText;
    },
    saveTodo() {
      console.log(this.$data.updatedTodo);
    }
  }
};
</script>

<style scoped>
.description {
  white-space: pre;
}
</style>
