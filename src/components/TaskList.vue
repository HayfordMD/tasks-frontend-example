<template>
  <div class="task-list">
    <div class="header-with-buttons">
      <h2>Tasks</h2>
    </div>
    <ul v-if="sortedTasks.length > 0">
      <li v-for="task in sortedTasks" :key="task.id" class="task-item">
        <div class="task-header">
          <h3>{{ task.name }}</h3>
          <span :class="{ 'public': task.public, 'private': !task.public }">
            {{ task.public ? 'Public' : 'Private' }}
          </span>
        </div>
        <p>{{ task.description }}</p>
        <p><span class="clock-icon">🕒</span> {{ task.dueDate }}</p>
        <div class="task-toggles">
          <button 
            :class="{ 'toggle-btn': true, 'active': task.important }" 
            @click="$emit('editTask', task.id, { important: !task.important })"
          >
            Important
          </button>
          <button 
            :class="{ 'toggle-btn': true, 'active': task.urgent }" 
            @click="$emit('editTask', task.id, { urgent: !task.urgent })"
          >
            Urgent
          </button>
          <span class="rating-container">
            <span class="rating-label">Rating:</span>
            <span 
              v-for="star in 5" 
              :key="star" 
              class="star" 
              :class="{ 'filled': star <= task.rating }"
              @click="$emit('editTask', task.id, { rating: star })"
            >
              ★
            </span>
          </span>
          <span class="voting-container">
            <span class="voting-label">Helps Win:</span>
            <button @click="$emit('editTask', task.id, { helpsWin: task.helpsWin + 1 })" class="vote-btn up">▲</button>
            <span class="vote-count">{{ task.helpsWin }}</span>
            <button @click="$emit('editTask', task.id, { helpsWin: task.helpsWin - 1 })" class="vote-btn down">▼</button>
          </span>
        </div>
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
  emits: ['editTask', 'deleteTask', 'shareTask', 'completeTask', 'followTask', 'summarizeTasks']
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

.task-toggles {
  display: flex;
  gap: 10px;
  margin-top: 5px;
  margin-bottom: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.toggle-btn {
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
  background-color: #f0f0f0;
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

.rating-container, .voting-container {
  display: flex;
  align-items: center;
}

.rating-label, .voting-label {
  font-size: 14px;
  margin-right: 5px;
}

.star {
  color: #ccc;
  cursor: pointer;
  font-size: 16px;
  transition: color 0.2s;
}

.star.filled {
  color: #ffd700;
}

.star:hover {
  color: #ffd700;
}

.vote-btn {
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 16px;
  padding: 0 5px;
  line-height: 1;
}

.vote-btn.up:hover {
  color: #28a745;
}

.vote-btn.down:hover {
  color: #dc3545;
}

.vote-count {
  font-size: 14px;
  min-width: 20px;
  text-align: center;
}

.share-btn, .delete-btn, .complete-btn, .follow-btn {
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

.complete-btn:hover {
  background-color: #218838;
}

.follow-btn {
  background-color: #007bff;
  color: white;
}

.follow-btn:hover {
  background-color: #0056b3;
}

.task-list-actions {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.summarize-btn {
  padding: 8px 15px;
  border: none;
  border-radius: 3px;
  background-color: #9c27b0;
  color: white;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.summarize-btn:hover {
  background-color: #7b1fa2;
}

.no-tasks {
  text-align: center;
  margin-top: 20px;
}
</style>
