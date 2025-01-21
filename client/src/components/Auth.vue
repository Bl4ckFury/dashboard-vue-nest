<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div v-if="!isLoading" class="bg-white p-8 rounded-lg shadow-md w-96">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Авторизация</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="username" class="block text-sm font-medium text-gray-600">Логин</label>
          <input
            type="text"
            id="username"
            v-model="username"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-600">Пароль</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          class="w-full px-4 py-2 bg-[rgb(1,114,193)] text-white rounded-lg hover:bg-[rgb(0,95,160)] transition-all duration-300"
        >
          Войти
        </button>
      </form>
    </div>

    <LoadingSpinner v-if="isLoading" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

export default {
  components: {
    LoadingSpinner,
  },
  data() {
    return {
      username: '',
      password: '',
    };
  },
  computed: {
    ...mapGetters(['isLoading']),
  },
  methods: {
    ...mapActions(['login']),
    async handleLogin() {
      if (!this.username || !this.password) {
        alert('Пожалуйста, заполните все поля');
        return;
      }

      try {
        await this.login({ username: this.username, password: this.password });
        this.$emit('login-success');
        this.$router.push('/');
      } catch (error) {
        alert(error.message || 'Произошла ошибка при авторизации');
      }
    },
  },
};
</script>