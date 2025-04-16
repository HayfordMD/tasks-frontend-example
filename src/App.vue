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
  </div>
</template>

<script>
import TaskList from './components/TaskList.vue'
import CompletedTasks from './components/CompletedTasks.vue'
import FollowingTasks from './components/FollowingTasks.vue'
import NewTaskForm from './components/NewTaskForm.vue'

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
      newTask.completed = false
      newTask.following = false
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
      this.completedTasks = this.completedTasks.filter(task => task.id !== taskId)
      this.followingTasks = this.followingTasks.filter(task => task.id !== taskId)
    },
    shareTask(taskId) {
      alert(`Use our current share selector for coach, player, position group, etc...`)
    },
    completeTask(taskId) {
      const index = this.tasks.findIndex(task => task.id === taskId)
      if (index !== -1) {
        this.tasks[index].completed = true
        this.completedTasks.push(this.tasks[index])
        this.tasks.splice(index, 1)
      }
    },
    uncompleteTask(taskId) {
      const index = this.completedTasks.findIndex(task => task.id === taskId)
      if (index !== -1) {
        this.completedTasks[index].completed = false
        this.tasks.push(this.completedTasks[index])
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
        this.tasks.push(this.followingTasks[index])
        this.followingTasks.splice(index, 1)
      }
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
