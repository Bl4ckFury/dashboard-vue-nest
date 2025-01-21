<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Список пользователей</h2>
    <ul>
      <li v-for="user in users" :key="user.id" class="mb-2 p-2 border rounded flex justify-between items-center">
        <div>
          <div class="font-bold">{{ user.name }}</div>
          <div>Логин: {{ user.login }}</div>
          <div>Должность: {{ user.position }}</div>
          <div>Функционал: {{ translatePermissions(user.permissions) }}</div>
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
      class="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
    >
      Создать пользователя
    </router-link>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  computed: {
    ...mapGetters(['users', 'isLoading']),
  },
  methods: {
    ...mapActions(['deleteUser']),
    hasPermission(permission) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      return currentUser?.permissions?.includes(permission);
    },
    translatePermissions(permissions) {
      const permissionTranslations = {
        view: 'Просмотр',
        edit: 'Редактирование',
        delete: 'Удаление',
        create_user: 'Создание пользователей',
        create_city: 'Создание городов',
        sql_scripts: 'Доступ к SQL скриптам',
      };
      return permissions.map((permission) => permissionTranslations[permission]).join(', ');
    },
  },
};
</script>

<style scoped>
button {
  transition: background-color 0.3s ease;
}
</style>