<template>
  <div class="new-task-form">
    <h2>Create New Task</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="name">Task Name (max 64 characters):</label>
        <input type="text" id="name" v-model="newTask.name" maxlength="64" required>
      </div>
      <div class="form-group">
        <label for="description">Description:</label>
        <textarea id="description" v-model="newTask.description" rows="3"></textarea>
      </div>
      <div class="form-group checkbox-group">
        <label for="isPublic">Public</label>
        <input type="checkbox" id="isPublic" v-model="newTask.isPublic">
      </div>
      <div class="form-group">
        <label for="dueDate">Due Date:</label>
        <select id="dueDate" v-model="newTask.dueDate">
          <option value="4 hours">4 Hours</option>
          <option value="1 day">1 Day</option>
          <option value="3 days">3 Days</option>
          <option value="1 week">1 Week</option>
          <option value="longer than 1 week">Longer than 1 Week</option>
        </select>
      </div>
      <div class="form-actions">
        <button type="submit" class="submit-btn">Add Task</button>
        <button type="button" @click="$emit('cancel')" class="cancel-btn">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'NewTaskForm',
  data() {
    return {
      newTask: {
        id: null,
        name: '',
        description: '',
        isPublic: false,
        dueDate: '1 week',
        showAdvanced: false
      }
    }
  },
  methods: {
    submitForm() {
      this.newTask.id = Date.now() // Simple unique ID
      this.$emit('addTask', { ...this.newTask })
      this.resetForm()
    },
    resetForm() {
      this.newTask = {
        id: null,
        name: '',
        description: '',
        isPublic: false,
        dueDate: '1 week',
        showAdvanced: false
      }
    }
  },
  emits: ['addTask', 'cancel']
}
</script>

<style scoped>
.new-task-form {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-bottom: 15px;
  text-align: center;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input[type="text"], textarea, select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

textarea {
  resize: vertical;
}

.checkbox-group {
  display: flex;
  align-items: center;
}

.checkbox-group label {
  margin-left: 10px;
  margin-bottom: 0;
  font-weight: normal;
}

input[type="checkbox"] {
  width: auto;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.submit-btn, .cancel-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.submit-btn {
  background-color: #007bff;
  color: white;
}

.submit-btn:hover {
  background-color: #0056b3;
}

.cancel-btn {
  background-color: #6c757d;
  color: white;
}

.cancel-btn:hover {
  background-color: #5a6268;
}
</style>
