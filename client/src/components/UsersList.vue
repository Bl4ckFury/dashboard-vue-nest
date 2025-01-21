<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Список пользователей</h2>
    <ul>
      <li
        v-for="(user, index) in users"
        :key="user.id"
        class="mb-2 p-4 border border-gray-200 rounded-lg shadow-sm flex justify-between items-center bg-white hover:bg-gray-50 transition-all duration-300 hover:shadow-md"
      >
        <div>
          <div class="font-bold text-lg">{{ index + 1 }}. {{ user.name }}</div>
          <div class="text-gray-600">Логин: {{ user.login }}</div>
          <div class="text-gray-600">Должность: {{ user.position }}</div>
          <div class="text-gray-600">Функционал: {{ translatePermissions(user.permissions) }}</div>
        </div>
        <button
          v-if="hasPermission('delete')"
          @click="deleteUser(user.id)"
          class="px-4 py-2 bg-brand text-white rounded-md hover:bg-brand-hover transition-all duration-300"
        >
          Удалить
        </button>
      </li>
    </ul>
    <router-link
      v-if="hasPermission('create_user')"
      to="/users/create"
      class="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-300"
    >
      Создать пользователя
    </router-link>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      users: JSON.parse(localStorage.getItem('users')) || [],
      permissionTranslations: {
        view: 'Просмотр',
        edit: 'Редактирование',
        delete: 'Удаление',
        create_user: 'Создание пользователей',
        create_city: 'Создание городов',
        sql_scripts: 'Доступ к SQL скриптам',
      },
    };
  },
  computed: {
    ...mapGetters(['isLoading']),
  },
  methods: {
    deleteUser(userId) {
      this.users = this.users.filter((user) => user.id !== userId);
      localStorage.setItem('users', JSON.stringify(this.users));
    },
    hasPermission(permission) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      return currentUser?.permissions?.includes(permission);
    },
    translatePermissions(permissions) {
      return permissions.map((permission) => this.permissionTranslations[permission]).join(', ');
    },
  },
  mounted() {
    console.log('Users:', this.users); // Проверка данных
  },
};
</script>

<style scoped>
/* Дополнительные стили, если нужно */
li {
  transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
}

li:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>