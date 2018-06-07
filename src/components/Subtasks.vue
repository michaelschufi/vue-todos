<template>
  <div>
    <Subtask v-for="subtask in subtasks" :key="subtask.id" :subtask="subtask" />
    <Subtask :todoId="todoId" :subtask="null" />
  </div>
</template>

<script>
import Subtask from '@/components/Subtask.vue'

export default {
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
