<template>
  <div class="app-container">
    <h1>Task Management</h1>
    <TaskList :tasks="tasks" @edit-task="editTask" @delete-task="deleteTask" @share-task="shareTask" />
    <button @click="showNewTaskForm = true" class="new-task-btn">Create New Task</button>
    <NewTaskForm v-if="showNewTaskForm" @add-task="addTask" @cancel="showNewTaskForm = false" />
  </div>
</template>

<script>
import TaskList from './components/TaskList.vue'
import NewTaskForm from './components/NewTaskForm.vue'

export default {
  name: 'App',
  components: {
    TaskList,
    NewTaskForm
  },
  data() {
    return {
      tasks: [],
      showNewTaskForm: false
    }
  },
  methods: {
    addTask(newTask) {
      this.tasks.push(newTask)
      this.showNewTaskForm = false
    },
    editTask(taskId, updatedData) {
      const index = this.tasks.findIndex(task => task.id === taskId)
      if (index !== -1) {
        this.tasks[index] = { ...this.tasks[index], ...updatedData }
      }
    },
    deleteTask(taskId) {
      this.tasks = this.tasks.filter(task => task.id !== taskId)
    },
    shareTask(taskId) {
      alert(`Sharing task with ID: ${taskId}`)
    }
  }
}
</script>

<style scoped>
.app-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.new-task-btn {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.new-task-btn:hover {
  background-color: #0056b3;
}
</style>
