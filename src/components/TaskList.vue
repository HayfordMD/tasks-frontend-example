<template>
  <div class="task-list">
    <h2>Tasks</h2>
    <ul v-if="tasks.length > 0">
      <li v-for="task in tasks" :key="task.id" class="task-item">
        <div class="task-header">
          <h3>{{ task.name }}</h3>
          <span :class="{ 'public': task.isPublic, 'private': !task.isPublic }">
            {{ task.isPublic ? 'Public' : 'Private' }}
          </span>
        </div>
        <p>{{ task.description }}</p>
        <div class="task-actions">
          <button @click="toggleAdvanced(task.id)" class="advanced-btn">{{ task.showAdvanced ? 'Hide Advanced' : 'Advanced' }}</button>
          <button @click="$emit('shareTask', task.id)" class="share-btn">Share</button>
          <button @click="$emit('deleteTask', task.id)" class="delete-btn">Delete</button>
        </div>
        <div v-if="task.showAdvanced" class="advanced-details">
          <p><strong>Due Date:</strong> {{ task.dueDate }}</p>
        </div>
      </li>
    </ul>
    <p v-else>No tasks available.</p>
  </div>
</template>

<script>
export default {
  name: 'TaskList',
  props: {
    tasks: {
      type: Array,
      required: true
    }
  },
  methods: {
    toggleAdvanced(taskId) {
      const task = this.tasks.find(task => task.id === taskId)
      if (task) {
        task.showAdvanced = !task.showAdvanced
      }
    }
  },
  emits: ['editTask', 'deleteTask', 'shareTask']
}
</script>

<style scoped>
.task-list {
  margin-bottom: 20px;
}

h2 {
  margin-bottom: 10px;
}

ul {
  list-style-type: none;
  padding: 0;
}

.task-item {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 10px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.task-header h3 {
  margin: 0;
  font-size: 18px;
}

.task-header span {
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 12px;
  font-weight: bold;
}

.public {
  background-color: #28a745;
  color: white;
}

.private {
  background-color: #dc3545;
  color: white;
}

.task-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.advanced-btn, .share-btn, .delete-btn {
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 14px;
}

.advanced-btn {
  background-color: #6c757d;
  color: white;
}

.share-btn {
  background-color: #17a2b8;
  color: white;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.advanced-details {
  margin-top: 10px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 5px;
}
</style>
