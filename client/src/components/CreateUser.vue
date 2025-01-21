<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Создать пользователя</h2>
    <form @submit.prevent="createUser">
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Имя</label>
        <input v-model="user.name" type="text" required
          class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Логин</label>
        <input v-model="user.login" type="text" required
          class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Пароль</label>
        <input v-model="user.password" type="password" required
          class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Должность</label>
        <input v-model="user.position" type="text" required
          class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Функционал</label>
        <div class="flex flex-wrap gap-4">
          <label v-for="option in permissionOptions" :key="option.value"
            class="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" v-model="user.permissions" :value="option.value"
              class="form-checkbox h-5 w-5 rounded border-gray-300 cursor-pointer" />
            <span class="text-gray-700">{{ option.label }}</span>
          </label>
        </div>
      </div>
      <button type="submit"
        class="px-4 py-2 bg-[rgb(1,114,193)] text-white rounded-md hover:bg-[rgb(0,95,160)] transition-all duration-300">
        Создать
      </button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        name: '',
        login: '',
        password: '',
        position: '',
        permissions: [],
      },
      permissionOptions: [
        { value: 'view', label: 'Просмотр' },
        { value: 'edit', label: 'Редактирование' },
        { value: 'delete', label: 'Удаление' },
        { value: 'create_user', label: 'Создание пользователей' },
        { value: 'create_city', label: 'Создание городов' },
        { value: 'sql_scripts', label: 'Доступ к SQL скриптам' },
      ],
    };
  },
  methods: {
    async createUser() {
      try {
        const response = await fetch('http://localhost:3000/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          body: JSON.stringify(this.user),
        });

        if (response.ok) {
          alert('Пользователь успешно создан!');
          this.$router.push('/users/list');
        } else {
          alert('Ошибка при создании пользователя');
        }
      } catch (error) {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при создании пользователя');
      }
    },
  },
};
</script>

<style scoped>
.form-checkbox {
  appearance: none;
  border: 2px solid;
  transition: background-color 0.2s, border-color 0.2s;
}

.form-checkbox:checked {
  background-color: rgb(1, 114, 193);
  border-color: rgb(1, 114, 193);
}
</style>