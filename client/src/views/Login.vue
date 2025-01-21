<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-96">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Вход</h2>
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
          class="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
        >
          Войти
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    handleLogin() {
      if (this.username === 'admin' && this.password === 'admin') {
        localStorage.setItem('access_token', 'fake-access-token'); // Добавлено
        localStorage.setItem('currentUser', JSON.stringify({
          id: 1,
          name: 'Admin',
          login: 'admin',
          position: 'Administrator',
          permissions: ['view', 'edit', 'delete', 'create_user', 'create_city', 'delete_city', 'sql_scripts'],
        }));
        this.$router.push('/'); // Перенаправляем на главную страницу
      } else {
        alert('Неверный логин или пароль');
      }
    },
  },
};
</script>