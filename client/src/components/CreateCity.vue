<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Создать город</h2>
    <form @submit.prevent="createCity">
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Название города</label>
        <input v-model="city.name" type="text" required
          class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
      </div>
      <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        Создать
      </button>
    </form>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';

export default {
  data() {
    return {
      city: {
        id: null,
        name: ''
      }
    };
  },
  methods: {
    createCity() {
      this.city.id = uuidv4(); // Генерация уникального ID
      this.$emit('create-city', this.city);
      this.resetForm();
    },
    resetForm() {
      this.city = {
        id: null,
        name: ''
      };
    }
  }
};
</script>

<style scoped>
/* Стили для CreateCity.vue */
.text-2xl {
  font-size: 1.5rem;
  line-height: 2rem;
}
.font-bold {
  font-weight: 700;
}
.mb-4 {
  margin-bottom: 1rem;
}
.block {
  display: block;
}
.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}
.font-medium {
  font-weight: 500;
}
.text-gray-700 {
  color: #374151;
}
.mt-1 {
  margin-top: 0.25rem;
}
.w-full {
  width: 100%;
}
.p-2 {
  padding: 0.5rem;
}
.border {
  border-width: 1px;
}
.border-gray-300 {
  border-color: #d1d5db;
}
.rounded-md {
  border-radius: 0.375rem;
}
.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}
.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
.bg-blue-500 {
  background-color: #3b82f6;
}
.text-white {
  color: #ffffff;
}
.hover\:bg-blue-600:hover {
  background-color: #2563eb;
}
</style>