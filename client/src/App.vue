<template>
  <div>
    <div v-if="isLoggedIn">
      <!-- Сайдбар -->
      <Sidebar @logout="handleLogout" />

      <!-- Основной контент -->
      <div class="ml-64 p-8">
        <!-- Имя пользователя (правый верхний угол) -->
        <div class="fixed top-4 right-4 z-50">
          <div @click="goToProfile" class="profile-name cursor-pointer text-gray-700 hover:text-brand">
            {{ user.name }}
          </div>
        </div>

        <!-- Роутер для отображения страниц -->
        <router-view></router-view>
      </div>
    </div>

    <!-- Компонент авторизации -->
    <Auth v-else @login-success="handleLoginSuccess" />
  </div>
</template>

<script>
import Auth from '@/components/Auth.vue';
import Sidebar from '@/components/Sidebar.vue';
import { mapState } from 'vuex';

export default {
  components: {
    Auth,
    Sidebar,
  },
  computed: {
    ...mapState(['user']), // Получаем данные пользователя из хранилища
  },
  data() {
    return {
      isLoggedIn: localStorage.getItem('access_token') !== null,
    };
  },
  methods: {
    handleLoginSuccess() {
      this.isLoggedIn = true;
    },
    handleLogout() {
      localStorage.removeItem('access_token');
      this.isLoggedIn = false;
      this.$router.push('/login');
    },
    goToProfile() {
      this.$router.push('/profile'); // Переход на страницу личного кабинета
    },
  },
};
</script>

<style>
/* Глобальные стили */
</style>