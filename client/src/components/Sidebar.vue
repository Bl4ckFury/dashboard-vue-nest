<template>
  <div class="bg-white w-64 h-screen shadow-lg fixed flex flex-col">
    <!-- Логотип -->
    <div class="p-6 border-b">
      <img src="../assets/image/logo.png" alt="Логотип" class="w-24 h-auto" />
    </div>

    <!-- Меню -->
    <div class="p-4 flex-1">
      <ul>
        <!-- Главная -->
        <li class="mb-2">
          <router-link to="/"
            class="block p-2 text-gray-700 hover:text-white hover:bg-primary rounded-lg transition-all duration-300 cursor-pointer">
            Главная
          </router-link>
        </li>

        <!-- Пользователи (с подменю) -->
        <li class="mb-2">
          <div @click="toggleUsersMenu"
            class="flex justify-between items-center p-2 text-gray-700 hover:text-white hover:bg-primary rounded-lg transition-all duration-300 cursor-pointer">
            <span>Пользователи</span>
            <svg class="w-4 h-4 transform transition-transform" :class="{ 'rotate-180': isUsersMenuOpen }"
              fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <!-- Подменю -->
          <ul v-if="isUsersMenuOpen" class="pl-4 mt-2">
            <li class="mb-2">
              <router-link to="/users/list"
                class="block p-2 text-gray-700 hover:text-white hover:bg-primary rounded-lg transition-all duration-300 cursor-pointer">
                Список пользователей
              </router-link>
            </li>
            <li class="mb-2">
              <router-link to="/users/create"
                class="block p-2 text-gray-700 hover:text-white hover:bg-primary rounded-lg transition-all duration-300 cursor-pointer">
                Создать пользователя
              </router-link>
            </li>
          </ul>
        </li>

        <!-- Города (с подменю) -->
        <li class="mb-2">
          <div @click="toggleCitiesMenu"
            class="flex justify-between items-center p-2 text-gray-700 hover:text-white hover:bg-primary rounded-lg transition-all duration-300 cursor-pointer">
            <span>Города</span>
            <svg class="w-4 h-4 transform transition-transform" :class="{ 'rotate-180': isCitiesMenuOpen }"
              fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <!-- Подменю -->
          <ul v-if="isCitiesMenuOpen" class="pl-4 mt-2">
            <li class="mb-2">
              <router-link to="/cities/list"
                class="block p-2 text-gray-700 hover:text-white hover:bg-primary rounded-lg transition-all duration-300 cursor-pointer">
                Список городов
              </router-link>
            </li>
            <li class="mb-2">
              <router-link to="/cities/create"
                class="block p-2 text-gray-700 hover:text-white hover:bg-primary rounded-lg transition-all duration-300 cursor-pointer">
                Создать город
              </router-link>
            </li>
          </ul>
        </li>

        <!-- Импорт -->
        <li class="mb-2">
          <router-link to="/import"
            class="block p-2 text-gray-700 hover:text-white hover:bg-primary rounded-lg transition-all duration-300 cursor-pointer">
            Импорт
          </router-link>
        </li>

        <!-- SQL скрипты -->
        <li class="mb-2">
          <router-link to="/sql-scripts"
            class="block p-2 text-gray-700 hover:text-white hover:bg-primary rounded-lg transition-all duration-300 cursor-pointer">
            SQL скрипты
          </router-link>
        </li>
      </ul>
    </div>

    <!-- Кнопка "Выйти" -->
    <div class="p-4 border-t">
      <button @click="logout"
        class="w-full p-2 text-white bg-[rgb(1,114,193)] hover:bg-[rgb(0,95,160)] rounded-lg transition-all duration-300 cursor-pointer">
        Выйти
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'Sidebar',
  setup(props, { emit }) {
    const isUsersMenuOpen = ref(false);
    const isCitiesMenuOpen = ref(false);

    const toggleUsersMenu = () => {
      isUsersMenuOpen.value = !isUsersMenuOpen.value;
    };

    const toggleCitiesMenu = () => {
      isCitiesMenuOpen.value = !isCitiesMenuOpen.value;
    };

    const logout = () => {
      emit('logout');
    };

    return {
      isUsersMenuOpen,
      isCitiesMenuOpen,
      toggleUsersMenu,
      toggleCitiesMenu,
      logout
    };
  }
};
</script>

<style scoped>
.router-link-active {
  @apply text-white bg-brand;
}
</style>