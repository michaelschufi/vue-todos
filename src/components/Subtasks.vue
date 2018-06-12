<template>
  <div>
    <Subtask v-for="subtask in subtasks" :key="subtask.todoId+subtask.id" :subtask="subtask" />
    <Subtask :subtask="emptySubtask" />
  </div>
</template>

<script>
import Subtask from '@/components/Subtask.vue'

export default {
  name: 'Subtasks',
  data() {
    return {
      emptySubtask: {
        todoId: this.todoId,
      },
    }
  },
  components: {
    Subtask,
  },
  props: {
    todoId: String,
  },
  computed: {
    subtasks() {
      return this.$store.getters.subtasks(this.todoId)
    },
  },
}
</script>
