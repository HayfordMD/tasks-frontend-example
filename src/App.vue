<template>
  <div class="app-container">
    <h3>This will be it's own tasks feed on the dashboard page put it next to coaches/players component</h3>
    <div class="tab-navigation">
      <button @click="currentTab = 'active'" :class="{ active: currentTab === 'active' }">Active Tasks</button>
      <button @click="currentTab = 'completed'" :class="{ active: currentTab === 'completed' }">Completed Tasks</button>
      <button @click="currentTab = 'following'" :class="{ active: currentTab === 'following' }">Following</button>
    </div>
    <TaskList v-if="currentTab === 'active'" :tasks="activeTasks" @edit-task="editTask" @delete-task="deleteTask" @share-task="shareTask" @complete-task="completeTask" @follow-task="followTask" />
    <CompletedTasks v-if="currentTab === 'completed'" :completed-tasks="completedTasks" @edit-task="editTask" @delete-task="deleteTask" @share-task="shareTask" @uncomplete-task="uncompleteTask" />
    <FollowingTasks v-if="currentTab === 'following'" :following-tasks="followingTasksComputed" @edit-task="editTask" @delete-task="deleteTask" @share-task="shareTask" @unfollow-task="unfollowTask" />
    <button @click="showNewTaskForm = true" class="new-task-btn">Create New Task</button>
    <NewTaskForm v-if="showNewTaskForm" @add-task="addTask" @cancel="showNewTaskForm = false" />
    <button @click="summarizeTasks" class="new-task-btn">Summarize Tasks</button>
    <button @click="showPayload" class="new-task-btn">Show Payload</button>
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
  setup() {
    const currentTab = ref('active')
    const tasks = ref([])
    const showNewTaskForm = ref(false)

    onMounted(() => {
      // Load default tasks on component mount
      tasks.value = [...defaultTasks]
    })

    const activeTasks = computed(() => tasks.value.filter(task => !task.completed && !task.following))
    const completedTasks = computed(() => tasks.value.filter(task => task.completed))
    const followingTasksComputed = computed(() => tasks.value.filter(task => task.following))

    const addTask = (task) => {
      task.id = tasks.value.length ? Math.max(...tasks.value.map(t => t.id)) + 1 : 1
      tasks.value.push(task)
      showNewTaskForm.value = false
    }

    const editTask = (taskId, updates) => {
      const index = tasks.value.findIndex(task => task.id === taskId)
      if (index !== -1) {
        tasks.value[index] = { ...tasks.value[index], ...updates }
      }
    }

    const deleteTask = (taskId) => {
      const index = tasks.value.findIndex(task => task.id === taskId)
      if (index !== -1) {
        tasks.value.splice(index, 1)
      }
    }

    const shareTask = (taskId) => {
      const task = tasks.value.find(task => task.id === taskId)
      if (task) {
        alert(`Shared task: ${task.name}`)
      }
    }

    const completeTask = (taskId) => {
      const index = tasks.value.findIndex(task => task.id === taskId)
      if (index !== -1) {
        tasks.value[index].completed = true
      }
    }

    const uncompleteTask = (taskId) => {
      const index = tasks.value.findIndex(task => task.id === taskId)
      if (index !== -1) {
        tasks.value[index].completed = false
      }
    }

    const followTask = (taskId) => {
      const index = tasks.value.findIndex(task => task.id === taskId)
      if (index !== -1) {
        tasks.value[index].following = true
      }
    }

    const unfollowTask = (taskId) => {
      const index = tasks.value.findIndex(task => task.id === taskId)
      if (index !== -1) {
        tasks.value[index].following = false
      }
    }

    const summarizeTasks = () => {
      // Prepare task data for API call
      const taskData = tasks.value.map(task => ({
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
      const prompt = `Given this data: ${JSON.stringify(taskData, null, 2)}, recommend the order to complete them in based on urgency, importance, rating, and win votes.`;
      console.log('Sending to DeepSeek API:', prompt);
      
      // Simulated response from API
      const simulatedResponse = generateSimulatedRecommendations(taskData);
      alert(`Task Completion Recommendations:\n${simulatedResponse}`);
      
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
        alert(`Task Completion Recommendations:\n${data.recommendations}`);
      })
      .catch(error => {
        console.error('Error fetching recommendations:', error);
        alert('Failed to fetch recommendations. Please try again later.');
      });
      */
    }

    const generateSimulatedRecommendations = (tasks) => {
      // Simple logic for demonstration purposes
      const sortedTasks = [...tasks].sort((a, b) => {
        if (a.urgent && !b.urgent) return -1;
        if (!a.urgent && b.urgent) return 1;
        if (a.important && !b.important) return -1;
        if (!a.important && b.important) return 1;
        if (a.rating !== b.rating) return b.rating - a.rating;
        return b.helpsWin - a.helpsWin;
      });
      return sortedTasks.map((task, index) => `${index + 1}. ${task.name}`).join('\n');
    }

    const showPayload = () => {
      // Prepare task data for API call
      const taskData = tasks.value.map(task => ({
        name: task.name,
        dueDate: task.dueDate,
        important: task.important,
        urgent: task.urgent,
        rating: task.rating,
        helpsWin: task.helpsWin
      }));
      
      // Format the payload as it would be sent to DeepSeek API
      const prompt = `Given this data: ${JSON.stringify(taskData, null, 2)}, recommend the order to complete them in based on urgency, importance, rating, and win votes.`;
      alert(`DeepSeek API Payload:\n\n${prompt}`);
    }

    return {
      currentTab,
      tasks,
      activeTasks,
      completedTasks,
      followingTasksComputed,
      showNewTaskForm,
      addTask,
      editTask,
      deleteTask,
      shareTask,
      completeTask,
      uncompleteTask,
      followTask,
      unfollowTask,
      summarizeTasks,
      showPayload
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

.tab-navigation {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.tab-navigation button {
  padding: 10px 20px;
  border: none;
  background-color: #e9ecef;
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px 5px 0 0;
}

.tab-navigation button.active {
  background-color: #007bff;
  color: white;
}

.tab-navigation button:hover:not(.active) {
  background-color: #dee2e6;
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
