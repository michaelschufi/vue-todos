<template>
  <div>
    <div class="lallalala" v-for="(subtask, index) in subtasks" :key="index">
      <Subtask :subtask="subtask" />
    </div>
    <Subtask :key="'empty'" :subtask="emptySubtask" />
  </div>
</template>

<script>
import Subtask from '@/components/Subtask.vue'

export default {
  name: 'Subtasks',
  components: {
    Subtask,
  },
  props: {
    todoId: String,
  },
  computed: {
    emptySubtask() {
      return {
        todoId: this.todoId,
      }
    },
    subtasks() {
      return this.$store.getters.subtasks(this.todoId)
    },
  },
}
</script>
