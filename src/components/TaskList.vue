<template>
  <div class="task-list">
    <div class="header-with-buttons">
      <h2>Tasks</h2>
    </div>
    <ul v-if="sortedTasks.length > 0">
      <li v-for="task in sortedTasks" :key="task.id" class="task-item">
        <div class="task-header">
          <h3>{{ task.name }}</h3>
          <div class="header-right">
            <span :class="{ 'public': task.public, 'private': !task.public }" class="task-privacy">{{ task.public ? 'Public' : 'Private' }}</span>
            <button @click="$emit('editTask', task.id, {})" class="edit-btn">Edit</button>
          </div>
        </div>
        <p>{{ task.description }}</p>
        <p><span class="clock-icon">🕒</span> {{ task.dueDate }}</p>
        <hr class="section-divider">
        <div class="task-details">
          <span class="task-toggles">
            <button @click="$emit('editTask', task.id, { urgent: !task.urgent })" :class="{ active: task.urgent }" class="toggle-btn urgent-btn">Urgent</button>
            <button @click="$emit('editTask', task.id, { important: !task.important })" :class="{ active: task.important }" class="toggle-btn important-btn">Important</button>
          </span>
          <span class="rating-container">
            <span class="rating-label">Rating:</span>
            <button v-for="star in 5" :key="star" @click="$emit('editTask', task.id, { rating: star })" class="star-btn" :class="{ 'filled': star <= task.rating }">★</button>
          </span>
          <span class="voting-container">
            <span class="voting-label">Helps Win:</span>
            <button @click="$emit('editTask', task.id, { helpsWin: task.helpsWin + 1 })" class="vote-btn up">▲</button>
            <span class="vote-count">{{ task.helpsWin }}</span>
            <button @click="$emit('editTask', task.id, { helpsWin: task.helpsWin > 0 ? task.helpsWin - 1 : 0 })" class="vote-btn down">▼</button>
          </span>
        </div>
        <hr class="section-divider">
        <div class="task-actions">
          <button @click="$emit('shareTask', task.id)" class="share-btn">Share</button>
          <button @click="$emit('deleteTask', task.id)" class="delete-btn">Delete</button>
          <button @click="$emit('completeTask', task.id)" class="complete-btn">Complete</button>
          <button @click="$emit('followTask', task.id)" class="follow-btn">Follow</button>
        </div>
      </li>
    </ul>
    <div v-else class="no-tasks">
      <p>No tasks available.</p>
    </div>
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
  computed: {
    sortedTasks() {
      return [...this.tasks].sort((a, b) => {
        const dueDates = {
          '4 hours': 0,
          '1 day': 1,
          '3 days': 2,
          '1 week': 3,
          'longer than 1 week': 4
        };
        return dueDates[a.dueDate] - dueDates[b.dueDate];
      });
    }
  },
  emits: ['editTask', 'deleteTask', 'shareTask', 'completeTask', 'followTask', 'summarizeTasks', 'createTask']
}
</script>

<style scoped>
.task-list {
  margin-bottom: 20px;
}

.header-with-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.header-buttons {
  display: flex;
  gap: 10px;
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
  transition: transform 0.2s, box-shadow 0.2s;
}

.task-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
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
  cursor: pointer;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.task-privacy {
  font-size: 14px;
  color: #6c757d;
}

.public {
  background-color: #28a745;
  color: white;
}

.private {
  background-color: #dc3545;
  color: white;
}

.clock-icon {
  font-size: 16px;
  margin-right: 5px;
}

.edit-btn {
  padding: 3px 8px;
  background-color: #ffc107;
  color: black;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.edit-btn:hover {
  background-color: #ff9800;
}

.task-details {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
  padding: 10px 0;
  background-color: #f8f9fa;
  border-radius: 5px;
}

.task-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.share-btn, .delete-btn, .complete-btn, .follow-btn, .edit-btn, .create-task-btn {
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

.complete-btn {
  background-color: #28a745;
  color: white;
}

.follow-btn {
  background-color: #ffc107;
  color: black;
}

.edit-btn {
  background-color: #007bff;
  color: white;
}

.create-task-btn {
  background-color: #007bff;
  color: white;
  margin-top: 10px;
}

.share-btn:hover {
  background-color: #138496;
}

.delete-btn:hover {
  background-color: #c82333;
}

.complete-btn:hover {
  background-color: #218838;
}

.follow-btn:hover {
  background-color: #e0a800;
}

.edit-btn:hover {
  background-color: #0056b3;
}

.create-task-btn:hover {
  background-color: #0056b3;
}

.no-tasks {
  text-align: center;
  color: #6c757d;
}

.rating-container, .voting-container {
  display: flex;
  align-items: center;
  gap: 5px;
}

.rating-label, .voting-label {
  font-size: 14px;
  color: #6c757d;
}

.star-btn {
  background: none;
  border: none;
  padding: 0;
  font-size: 24px;
  cursor: pointer;
  color: #d4af37;
  opacity: 0.23;
}

.star-btn.filled {
  color: #febe00;
  opacity: 1;
}

.star-btn:hover {
  opacity: 0.6;
}

.vote-btn {
  background: none;
  border: none;
  padding: 0;
  font-size: 16px;
  cursor: pointer;
  color: #6c757d;
  line-height: 1;
}

.vote-btn.up:hover {
  color: #28a745;
}

.vote-btn.down:hover {
  color: #dc3545;
}

.vote-count {
  font-size: 16px;
  color: #6c757d;
  min-width: 20px;
  text-align: center;
}

.task-toggles {
  display: flex;
  gap: 10px;
  margin-top: 5px;
  margin-bottom: 10px;
  align-items: center;
}

.toggle-btn {
  padding: 5px 10px;
  border: 1px solid black;
  border-radius: 3px;
  background-color: white;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.toggle-btn.active {
  background-color: #ff9800;
  color: white;
  border-color: #ff9800;
}

.toggle-btn:hover:not(.active) {
  background-color: #e0e0e0;
}

.urgent-btn.active {
  background-color: #dc3545;
  color: white;
  border-color: #dc3545;
}

.important-btn.active {
  background-color: #ffc107;
  color: black;
  border-color: #ffc107;
}

.section-divider {
  margin: 10px 0;
  border: 0;
  border-top: 1px solid #e0e0e0;
}
</style>
