<template>
  <div class="new-task-form">
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="taskName">Task Name (max 64 characters)</label>
        <div class="input-with-icon">
          <input
            type="text"
            id="taskName"
            v-model="newTask.name"
            maxlength="64"
            placeholder="Enter task name"
            @input="updateMagicButton"
          />
          <span
            class="magic-button"
            :class="{ 'active': newTask.name.length >= 30 }"
            @click.stop="generateDescription"
            title="Generate description from task name"
          >✨</span>
        </div>
        <small class="character-count">{{ newTask.name.length }}/64</small>
      </div>
      <div class="form-group">
        <label for="taskDescription">Description</label>
        <textarea
          id="taskDescription"
          v-model="newTask.description"
          placeholder="Enter task description"
          rows="3"
          :disabled="isLoadingDescription"
        ></textarea>
        <div v-if="isLoadingDescription" class="loading-overlay">
          <div class="deepseek-loading">
            <div class="loading-circle"></div>
            <div class="loading-circle"></div>
            <div class="loading-circle"></div>
            <span>Generating with DeepSeek...</span>
          </div>
        </div>
      </div>
      <div class="form-group">
        <label for="isPublic">Public</label>
        <input type="checkbox" id="isPublic" v-model="newTask.public">
        <!-- Share Button next to Public checkbox -->
      <button type="button" @click="$emit('shareTask', newTask.id)" class="share-btn">Share</button>
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
import config from '../config.js';

export default {
  name: 'NewTaskForm',
  data() {
    return {
      newTask: {
        id: null,
        name: '',
        description: '',
        public: false,
        dueDate: '1 week',
        showAdvanced: false
      },
      isLoadingDescription: false
    }
  },
  methods: {
    submitForm() {
      if (this.newTask.name.trim() === '') {
        alert('Task name is required.');
        return;
      }
      this.newTask.id = Date.now() // Simple unique ID
      this.$emit('addTask', { ...this.newTask })
      this.resetForm()
    },
    resetForm() {
      this.newTask = {
        id: null,
        name: '',
        description: '',
        public: false,
        dueDate: '1 week',
        showAdvanced: false
      }
    },
    updateMagicButton() {
      // This method is just for consistency, actual logic is handled by v-bind:class
    },
    generateDescription() {
      console.log('Magic button clicked!');
      if (this.newTask.name.length < 30) {
        alert('Task name must be at least 30 characters long to generate a description.');
        return;
      }
      
      this.isLoadingDescription = true;
      
      // Use API key from config
      const apiKey = config.deepSeekApiKey;
      const endpoint = 'https://api.deepseek.com/v1/chat/completions';
      
      // Prepare the prompt for DeepSeek API
      const prompt = `Given the task name: "${this.newTask.name}", generate a brief description for this task. Do not use the string **Task Description:**  `;
      console.log('Sending to DeepSeek API for description - Payload:', { prompt, endpoint, apiKey: apiKey ? 'Key Present' : 'Key Missing' });
      
      // Actual API call using fetch
      fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: 'You are a helpful assistant that generates concise task descriptions.' },
            { role: 'user', content: prompt }
          ],
          stream: false
        })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Received from DeepSeek API - Response:', data);
        if (data.choices && data.choices.length > 0 && data.choices[0].message) {
          this.newTask.description = data.choices[0].message.content.trim();
        } else {
          throw new Error('Unexpected response format from DeepSeek API');
        }
      })
      .catch(error => {
        console.error('Error fetching description:', error);
        // Fallback to simulated description on error
        const simulatedDescription = this.generateSimulatedDescription(this.newTask.name);
        console.log('Falling back to simulated description:', { description: simulatedDescription });
        this.newTask.description = simulatedDescription;
        alert('Failed to fetch description from DeepSeek API. Using a simulated description instead.');
      })
      .finally(() => {
        this.isLoadingDescription = false;
      });
    },
    generateSimulatedDescription(taskName) {
      // Simple logic for demonstration purposes
      return `This is a generated description for "${taskName}" to help clarify the task objective.`;
    }
  },
  emits: ['addTask', 'cancel', 'shareTask']
}
</script>

<style scoped>
.new-task-form {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input[type="text"],
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  box-sizing: border-box;
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-icon input {
  padding-right: 40px; /* Make room for the icon */
}

.magic-button {
  position: absolute;
  right: 10px;
  cursor: pointer;
  color: #ff4081;
  font-size: 18px;
  opacity: 0.3;
  user-select: none;
  z-index: 10;
}

.magic-button.active {
  opacity: 1;
  cursor: pointer;
}

.magic-button:hover.active {
  color: #ff80ab;
}

.character-count {
  display: block;
  text-align: right;
  font-size: 12px;
  color: #6c757d;
  margin-top: 5px;
}

.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background-color: white;
  box-sizing: border-box;
}

.toggle-switch {
  display: inline-block;
  width: 60px;
  height: 34px;
  position: relative;
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

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  z-index: 100;
}

.deepseek-loading {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  color: #007bff;
  animation: pulse 2s infinite ease-in-out;
}

.loading-circle {
  width: 12px;
  height: 12px;
  background-color: #007bff;
  border-radius: 50%;
  animation: bounce 1.5s infinite ease-in-out;
}

.loading-circle:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-circle:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}
</style>
