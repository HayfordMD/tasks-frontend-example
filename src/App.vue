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
import TaskList from './components/TaskList.vue'
import CompletedTasks from './components/CompletedTasks.vue'
import FollowingTasks from './components/FollowingTasks.vue'
import NewTaskForm from './components/NewTaskForm.vue'
import config from './config';

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
      tasks: [],
      completedTasks: [],
      followingTasks: [],
      showNewTaskForm: false,
      currentTab: 'active'
    }
  },
  computed: {
    activeTasks() {
      return this.tasks.filter(task => !task.completed && !task.following)
    },
    followingTasksComputed() {
      return this.tasks.filter(task => task.following)
    }
  },
  methods: {
    addTask(newTask) {
      const task = {
        id: Date.now(),
        name: newTask.name,
        description: newTask.description,
        public: newTask.public,
        dueDate: newTask.dueDate,
        completed: false,
        following: false,
        important: false,
        urgent: false,
        rating: 0,
        helpsWin: 0
      }
      this.tasks.push(task)
      this.showNewTaskForm = false
    },
    editTask(taskId, updatedData) {
      let index = this.tasks.findIndex(task => task.id === taskId)
      if (index !== -1) {
        this.tasks[index] = { ...this.tasks[index], ...updatedData }
        return
      }
      index = this.completedTasks.findIndex(task => task.id === taskId)
      if (index !== -1) {
        this.completedTasks[index] = { ...this.completedTasks[index], ...updatedData }
        return
      }
      index = this.followingTasks.findIndex(task => task.id === taskId)
      if (index !== -1) {
        this.followingTasks[index] = { ...this.followingTasks[index], ...updatedData }
      }
    },
    deleteTask(taskId) {
      this.tasks = this.tasks.filter(task => task.id !== taskId)
      this.completedTasks = this.completedTasks.filter(task => task.id !== taskId)
      this.followingTasks = this.followingTasks.filter(task => task.id !== taskId)
    },
    shareTask(taskId) {
      alert(`Use our current share selector for coach, player, position group, etc...`)
    },
    completeTask(taskId) {
      let index = this.tasks.findIndex(task => task.id === taskId)
      if (index !== -1) {
        this.tasks[index].completed = true
        this.completedTasks.push(this.tasks[index])
        this.tasks.splice(index, 1)
        return
      }
      index = this.followingTasks.findIndex(task => task.id === taskId)
      if (index !== -1) {
        this.followingTasks[index].completed = true
        this.completedTasks.push(this.followingTasks[index])
        this.followingTasks.splice(index, 1)
      }
    },
    uncompleteTask(taskId) {
      const index = this.completedTasks.findIndex(task => task.id === taskId)
      if (index !== -1) {
        this.completedTasks[index].completed = false
        if (this.completedTasks[index].following) {
          this.followingTasks.push(this.completedTasks[index])
        } else {
          this.tasks.push(this.completedTasks[index])
        }
        this.completedTasks.splice(index, 1)
      }
    },
    followTask(taskId) {
      const index = this.tasks.findIndex(task => task.id === taskId)
      if (index !== -1) {
        this.tasks[index].following = true
        this.followingTasks.push(this.tasks[index])
        this.tasks.splice(index, 1)
      }
    },
    unfollowTask(taskId) {
      const index = this.followingTasks.findIndex(task => task.id === taskId)
      if (index !== -1) {
        this.followingTasks[index].following = false
        if (this.followingTasks[index].completed) {
          this.completedTasks.push(this.followingTasks[index])
        } else {
          this.tasks.push(this.followingTasks[index])
        }
        this.followingTasks.splice(index, 1)
      }
    },
    summarizeTasks() {
      // Prepare task data for API call
      const taskData = this.tasks.map(task => ({
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
      const simulatedResponse = this.generateSimulatedRecommendations(taskData);
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
      return sortedTasks.map((task, index) => `${index + 1}. ${task.name}`).join('\n');
    },
    showPayload() {
      // Prepare task data for API call
      const taskData = this.tasks.map(task => ({
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
