<template>
  <div class="user-profile">
    <!-- Имя пользователя (кликабельное) -->
    <div v-if="!isProfilePage" class="profile-name" @click="goToProfile">
      <span class="text-gray-700 hover:text-brand cursor-pointer">{{ user.name }}</span>
    </div>

    <!-- Контент личного кабинета -->
    <div class="profile-content">
      <!-- Информация о пользователе -->
      <div class="mb-4">
        <p><strong>Имя:</strong> {{ user.name }}</p>
        <p><strong>Должность:</strong> {{ user.position }}</p>
      </div>

      <!-- Поле для привязки почты -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Привязанная почта</label>
        <input
          v-model="user.email"
          type="email"
          placeholder="Введите email"
          class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand focus:border-brand"
          :disabled="isEmailBound"
        />
      </div>

      <!-- Кнопки управления почтой -->
      <div class="flex space-x-4 mb-4">
        <button
          v-if="!isEmailBound"
          @click="bindEmail"
          class="px-4 py-2 bg-brand text-white rounded-md hover:bg-brand-dark transition-all duration-300"
        >
          Сохранить
        </button>
        <button
          v-if="isEmailBound"
          @click="unbindEmail"
          class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all duration-300"
        >
          Отвязать
        </button>
        <button
          v-if="isEmailBound"
          @click="confirmUnbind"
          class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-all duration-300"
        >
          Подтвердить
        </button>
        <button
          v-if="isEmailBound"
          @click="cancelUnbind"
          class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-all duration-300"
        >
          Отменить
        </button>
      </div>

      <!-- Список скачанных отчетов -->
      <div class="mt-6">
        <h3 class="text-lg font-semibold mb-2">Скачанные отчеты</h3>
        <ul>
          <li v-for="(report, index) in downloadedReports" :key="index" class="mb-2">
            <p><strong>Дата:</strong> {{ report.date }}</p>
            <p><strong>Тип:</strong> {{ report.type }}</p>
            <p><strong>Почта:</strong> {{ report.email }}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'UserProfile',
  props: {
    isProfilePage: {
      type: Boolean,
      default: false, // По умолчанию это не страница профиля
    },
  },
  data() {
    return {
      isEmailBound: false,
      isConfirmingUnbind: false,
    };
  },
  computed: {
    ...mapState(['user', 'downloadedReports']),
  },
  methods: {
    ...mapActions(['updateUserEmail', 'addDownloadedReport']),
    bindEmail() {
      if (this.user.email) {
        this.updateUserEmail(this.user.email);
        this.isEmailBound = true;
      }
    },
    unbindEmail() {
      this.isConfirmingUnbind = true;
    },
    confirmUnbind() {
      this.updateUserEmail('');
      this.isEmailBound = false;
      this.isConfirmingUnbind = false;
    },
    cancelUnbind() {
      this.isConfirmingUnbind = false;
    },
    goToProfile() {
      this.$router.push('/profile'); // Переход на страницу личного кабинета
    },
  },
  watch: {
    'user.email': {
      handler(newEmail) {
        this.isEmailBound = !!newEmail;
      },
      immediate: true,
    },
  },
};
</script>

<style scoped>
.profile-name {
  cursor: pointer;
  font-weight: 500;
  color: #4b5563; /* Цвет текста */
}

.profile-name:hover {
  color: #1d4ed8; /* Цвет при наведении */
}

.profile-content {
  max-width: 600px;
  margin: 0 auto;
}
</style>