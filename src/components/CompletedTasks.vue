<template>
  <div class="completed-tasks">
    <h2>Completed Tasks</h2>
    <ul v-if="completedTasks.length > 0">
      <li v-for="task in completedTasks" :key="task.id" class="task-item">
        <div class="task-header">
          <h3>{{ task.name }}</h3>
          <span :class="{ 'public': task.public, 'private': !task.public }">
            {{ task.public ? 'Public' : 'Private' }}
          </span>
        </div>
        <p>{{ task.description }}</p>
        <p><span class="clock-icon">🕒</span> {{ task.dueDate }}</p>
        <div class="task-actions">
          <button @click="$emit('shareTask', task.id)" class="share-btn">Share</button>
          <button @click="$emit('deleteTask', task.id)" class="delete-btn">Delete</button>
          <button @click="$emit('uncompleteTask', task.id)" class="uncomplete-btn">Uncomplete</button>
        </div>
      </li>
    </ul>
    <p v-else>No completed tasks.</p>
  </div>
</template>

<script>
export default {
  name: 'CompletedTasks',
  props: {
    completedTasks: {
      type: Array,
      required: true
    }
  },
  emits: ['editTask', 'deleteTask', 'shareTask', 'uncompleteTask']
}
</script>

<style scoped>
.completed-tasks {
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

.clock-icon {
  font-size: 16px;
  margin-right: 5px;
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

.share-btn, .delete-btn, .uncomplete-btn {
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 14px;
}

.share-btn {
  background-color: #17a2b8;
  color: white;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.uncomplete-btn {
  background-color: #ffc107;
  color: black;
}

.uncomplete-btn:hover {
  background-color: #e0a800;
}
</style>
