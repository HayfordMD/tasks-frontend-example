<template>
  <div class="app-container">
    <div class="tabs-container">
      <div class="tabs">
        <button @click="currentTab = 'active'" :class="{ active: currentTab === 'active' }">Active Tasks</button>
        <button @click="currentTab = 'completed'" :class="{ active: currentTab === 'completed' }">Completed Tasks</button>
        <button @click="currentTab = 'following'" :class="{ active: currentTab === 'following' }">Following Tasks</button>
      </div>
      <button @click="summarizeTasks" class="summarize-btn">Summarize Tasks</button>
    </div>
    <button @click="showNewTaskForm = true" class="new-task-btn">Create New Task</button>
    <NewTaskForm v-if="showNewTaskForm" @add-task="addTask" @cancel="showNewTaskForm = false" />
    <div class="tab-content">
      <div v-if="currentTab === 'active'" class="tasks-container">
        <TaskList :tasks="activeTasks" @edit-task="editTask" @delete-task="deleteTask" @share-task="shareTask" @complete-task="completeTask" @follow-task="followTask" />
      </div>
      <div v-else-if="currentTab === 'completed'" class="tasks-container">
        <CompletedTasks :completed-tasks="completedTasks" @edit-task="editTask" @delete-task="deleteTask" @share-task="shareTask" @uncomplete-task="uncompleteTask" />
      </div>
      <div v-else-if="currentTab === 'following'" class="tasks-container">
        <FollowingTasks :following-tasks="followingTasksComputed" @edit-task="editTask" @delete-task="deleteTask" @share-task="shareTask" @unfollow-task="unfollowTask" />
      </div>
    </div>
    
    <!-- Recommendations Modal -->
    <div v-if="showRecommendationsModal" class="modal-overlay">
      <div class="modal-content">
        <h2>DeepSeek AI Recommendations</h2>
        <pre>{{ recommendations }}</pre>
        <button @click="showRecommendationsModal = false" class="close-btn">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import TaskList from './components/TaskList.vue'
import CompletedTasks from './components/CompletedTasks.vue'
import FollowingTasks from './components/FollowingTasks.vue'
import NewTaskForm from './components/NewTaskForm.vue'
import defaultTasks from './defaultTasks.js'
import config from './config.js'

export default {
  name: 'App',
  components: {
    TaskList,
    CompletedTasks,
    FollowingTasks,
    NewTaskForm
  },
  data() {
    return {
      currentTab: 'active',
      tasks: [],
      showNewTaskForm: false,
      showRecommendationsModal: false,
      recommendations: ''
    }
  },
  methods: {
    summarizeTasks() {
      // Prepare task data for API call - only active tasks (not completed or following)
      const taskData = this.tasks
        .filter(task => !task.completed && !task.following)
        .map(task => ({
          name: task.name,
          dueDate: task.dueDate,
          important: task.important,
          urgent: task.urgent,
          rating: task.rating,
          helpsWin: task.helpsWin
        }));
      
      // Use API key from config
      const apiKey = config.deepSeekApiKey;
      const endpoint = 'https://api.deepseek.com/v1/recommendations';
      
      // Mock API call - in a real scenario, you would use fetch or axios
      // For demonstration, we'll simulate the response
      const prompt = `Given this data: ${JSON.stringify(taskData, null, 2)}, recommend the order to complete them in based on urgency, importance, rating, and win votes. Additionally, provide a priority rating out of 100 for each task, where 100 is the highest possible priority.`;
      console.log('Sending to DeepSeek API:', prompt);
      
      // Simulated response from API
      const simulatedResponse = this.generateSimulatedRecommendations(taskData);
      this.recommendations = simulatedResponse;
      this.showRecommendationsModal = true;
      
      // Uncomment and configure this for actual API integration:
      /*
      fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      })
      .then(response => response.json())
      .then(data => {
        this.recommendations = data.recommendations;
        this.showRecommendationsModal = true;
      })
      .catch(error => {
        console.error('Error fetching recommendations:', error);
        alert('Failed to fetch recommendations. Please try again later.');
      });
      */
    },
    generateSimulatedRecommendations(tasks) {
      // Simple logic for demonstration purposes
      const sortedTasks = [...tasks].sort((a, b) => {
        if (a.urgent && !b.urgent) return -1;
        if (!a.urgent && b.urgent) return 1;
        if (a.important && !b.important) return -1;
        if (!a.important && b.important) return 1;
        if (a.rating !== b.rating) return b.rating - a.rating;
        return b.helpsWin - a.helpsWin;
      });
      // Create a formatted table with a priority rating
      let result = 'Order | Task Name            | Priority (1-100)\n';
      result += '------|----------------------|------------------\n';
      sortedTasks.forEach((task, index) => {
        // Simulate a priority rating based on some logic (for demo purposes)
        const priorityRating = Math.min(100, Math.max(1, Math.round((task.urgent ? 30 : 0) + (task.important ? 20 : 0) + task.rating * 10 + task.helpsWin * 5)));
        const paddedName = task.name.padEnd(20).substring(0, 20);
        result += `${index + 1}.    | ${paddedName} | ${priorityRating}\n`;
      });
      return result;
    },
    addTask(task) {
      task.id = this.tasks.length ? Math.max(...this.tasks.map(t => t.id)) + 1 : 1;
      this.tasks.push(task);
      this.showNewTaskForm = false;
    },
    editTask(taskId, updates) {
      const index = this.tasks.findIndex(task => task.id === taskId);
      if (index !== -1) {
        this.tasks[index] = { ...this.tasks[index], ...updates };
      }
    },
    deleteTask(taskId) {
      const index = this.tasks.findIndex(task => task.id === taskId);
      if (index !== -1) {
        this.tasks.splice(index, 1);
      }
    },
    shareTask(taskId) {
      const task = this.tasks.find(task => task.id === taskId);
      if (task) {
        alert(`Shared task: ${task.name}`);
      }
    },
    completeTask(taskId) {
      const index = this.tasks.findIndex(task => task.id === taskId);
      if (index !== -1) {
        this.tasks[index].completed = true;
      }
    },
    uncompleteTask(taskId) {
      const index = this.tasks.findIndex(task => task.id === taskId);
      if (index !== -1) {
        this.tasks[index].completed = false;
      }
    },
    followTask(taskId) {
      const index = this.tasks.findIndex(task => task.id === taskId);
      if (index !== -1) {
        this.tasks[index].following = true;
      }
    },
    unfollowTask(taskId) {
      const index = this.tasks.findIndex(task => task.id === taskId);
      if (index !== -1) {
        this.tasks[index].following = false;
      }
    }
  },
  setup() {
    const tasks = ref([]);
    const showNewTaskForm = ref(false);

    onMounted(() => {
      // Load default tasks on component mount
      tasks.value = [...defaultTasks];
    });

    const activeTasks = computed(() => tasks.value.filter(task => !task.completed && !task.following));
    const completedTasks = computed(() => tasks.value.filter(task => task.completed));
    const followingTasksComputed = computed(() => tasks.value.filter(task => task.following));

    return {
      tasks,
      activeTasks,
      completedTasks,
      followingTasksComputed,
      showNewTaskForm
    };
  }
}
</script>

<style scoped>
.app-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.tabs-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.tabs {
  display: flex;
  gap: 10px;
}

.tabs button {
  padding: 10px 15px;
  border: none;
  background-color: #eee;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
  transition: background-color 0.3s;
}

.tabs button.active {
  background-color: #007bff;
  color: white;
}

.tabs button:hover:not(.active) {
  background-color: #ddd;
}

.new-task-btn, .summarize-btn {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.new-task-btn:hover, .summarize-btn:hover {
  background-color: #0056b3;
}

.tab-content {
  margin-top: 20px;
}

.tasks-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  max-width: 600px;
  width: 90%;
  text-align: center;
}

.modal-content h2 {
  margin-top: 0;
  color: #007bff;
}

.modal-content pre {
  white-space: pre-wrap;
  text-align: left;
  font-family: monospace;
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 3px;
  overflow: auto;
  max-height: 400px;
}

.close-btn {
  padding: 10px 15px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.close-btn:hover {
  background-color: #5a6268;
}
</style>
