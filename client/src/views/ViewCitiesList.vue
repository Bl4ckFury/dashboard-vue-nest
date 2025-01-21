<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Список городов</h2>
    <ul>
      <li v-for="city in cities" :key="city.id" class="mb-2 p-2 border rounded flex justify-between items-center">
        <div class="font-bold">{{ city.name }}</div>
        <button
          v-if="hasPermission('delete_city')"
          @click="deleteCity(city.id)"
          class="px-4 py-2 bg-brand text-white rounded-md hover:bg-brand-hover transition-all duration-300"
        >
          Удалить
        </button>
      </li>
    </ul>
    <router-link
      v-if="hasPermission('create_city')"
      to="/cities/create"
      class="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
    >
      Создать город
    </router-link>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  computed: {
    ...mapGetters(['cities', 'isLoading']),
  },
  methods: {
    ...mapActions(['deleteCity']),
    hasPermission(permission) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      return currentUser?.permissions?.includes(permission);
    },
  },
};
</script>

<style scoped>
button {
  transition: background-color 0.3s ease;
}
</style>