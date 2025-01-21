<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Список городов</h2>
    <ul>
      <li v-for="(city, index) in cities" :key="city.id" class="mb-2 p-4 border rounded-lg shadow-sm flex justify-between items-center bg-white hover:bg-gray-50 transition-all">
        <div class="font-bold text-lg">{{ index + 1 }}. {{ city.name }}</div>
        <button
          v-if="hasPermission('delete_city')"
          @click="deleteCity(city.id)"
          class="px-4 py-2 bg-brand text-white rounded-md hover:bg-brand-hover transition-all duration-300"
        >
          Удалить
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    cities: {
      type: Array,
      required: true,
    },
  },
  methods: {
    deleteCity(cityId) {
      this.$emit('delete-city', cityId);
    },
    hasPermission(permission) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      console.log('Current User:', currentUser); // Проверка текущего пользователя
      console.log('Has Permission:', permission, currentUser?.permissions?.includes(permission)); // Проверка прав
      return currentUser?.permissions?.includes(permission);
    },
  },
  mounted() {
    console.log('Cities:', this.cities); // Проверка данных
  },
};
</script>

<style scoped>
li {
  transition: background-color 0.3s ease, transform 0.3s ease;
}

li:hover {
  transform: translateY(-2px);
}
</style>