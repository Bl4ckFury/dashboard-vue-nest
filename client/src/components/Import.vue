<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-8">Импорт данных</h1>
    <div class="bg-white p-6 rounded-lg shadow-md">
      <!-- Стилизованные вкладки -->
      <div class="flex border-b border-gray-200 mb-4">
        <button
          @click="currentTab = 'generate'"
          :class="[
            'px-4 py-2 text-sm font-medium focus:outline-none',
            currentTab === 'generate'
              ? 'text-brand border-b-2 border-brand'
              : 'text-gray-500 hover:text-gray-700',
          ]"
        >
          Формирование отчета
        </button>
        <button
          @click="currentTab = 'reports'"
          :class="[
            'px-4 py-2 text-sm font-medium focus:outline-none',
            currentTab === 'reports'
              ? 'text-brand border-b-2 border-brand'
              : 'text-gray-500 hover:text-gray-700',
          ]"
        >
          Список отчетов
        </button>
      </div>

      <!-- Вкладка формирования отчета -->
      <div v-if="currentTab === 'generate'">
        <!-- Поля выбора даты и периода -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">Выберите дату</label>
          <input
            v-model="selectedDate"
            type="date"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand focus:border-brand custom-date-input"
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">Выберите период</label>
          <div class="flex space-x-4">
            <input
              v-model="startDate"
              type="date"
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand focus:border-brand custom-date-input"
            />
            <input
              v-model="endDate"
              type="date"
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand focus:border-brand custom-date-input"
            />
          </div>
        </div>

        <!-- Кнопки фильтра, отправки отчета и формирования отчета -->
        <div class="flex space-x-4 mb-4">
          <button
            @click="openFilterModal"
            class="px-4 py-2 bg-[rgb(1,114,193)] text-white rounded-md hover:bg-[rgb(0,95,160)] transition-all duration-300"
          >
            Фильтр
          </button>
          <button
            @click="openEmailModal"
            class="px-4 py-2 bg-[rgb(1,114,193)] text-white rounded-md hover:bg-[rgb(0,95,160)] transition-all duration-300"
          >
            Отправить отчет
          </button>
          <button
            @click="handleGenerateReport"
            class="px-4 py-2 bg-brand text-white rounded-md hover:bg-brand-dark transition-all duration-300"
          >
            Сформировать отчет
          </button>
        </div>

        <!-- Состояние отчета -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center p-8">
          <div class="spinner-large"></div>
          <span class="mt-4 text-lg text-gray-700 animate-pulse">Отчет формируется...</span>
        </div>
        <div v-else-if="reportGenerated" class="p-4 bg-green-100 text-green-700 rounded-md mt-4">
          Отчет успешно сформирован!
        </div>
        <div v-else class="p-4 bg-gray-100 text-gray-700 rounded-md mt-4">
          Отчет не сформирован
        </div>
      </div>

      <!-- Вкладка списка отчетов -->
      <div v-if="currentTab === 'reports'">
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white">
            <thead>
              <tr>
                <th class="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Дата
                </th>
                <th class="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Тип оплаты
                </th>
                <th class="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Тип билета
                </th>
                <th class="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Номер заказа
                </th>
                <th class="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Маршрут
                </th>
                <th class="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(report, index) in reports" :key="index" class="hover:bg-gray-50">
                <td class="px-6 py-4 border-b border-gray-200">{{ report.date }}</td>
                <td class="px-6 py-4 border-b border-gray-200">{{ report.paymentType }}</td>
                <td class="px-6 py-4 border-b border-gray-200">{{ report.ticketType }}</td>
                <td class="px-6 py-4 border-b border-gray-200">{{ report.orderNumber }}</td>
                <td class="px-6 py-4 border-b border-gray-200">{{ report.route }}</td>
                <td class="px-6 py-4 border-b border-gray-200">
                  <button
                    @click="downloadReport(report)"
                    class="px-4 py-2 bg-brand text-white rounded-md hover:bg-brand-dark transition-all duration-300"
                  >
                    Скачать
                  </button>
                  <button
                    @click="deleteReport(report.id)"
                    class="ml-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all duration-300"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Кнопка "Наверх" -->
        <button
          v-if="showScrollToTop"
          @click="scrollToTop"
          class="fixed bottom-8 right-8 px-4 py-2 bg-brand text-white rounded-md hover:bg-brand-dark transition-all duration-300"
        >
          Наверх
        </button>
      </div>

      <!-- Модальное окно с фильтрами -->
      <div
        v-if="isFilterModalOpen"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
        @click.self="closeFilterModal"
      >
        <div class="bg-white rounded-lg shadow-md w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <h2 class="text-xl font-bold mb-4 text-brand">Фильтры</h2>
            <!-- Поля фильтров -->
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Период</label>
                <div class="flex space-x-4">
                  <input
                    v-model="filterStartDate"
                    type="date"
                    class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand focus:border-brand custom-date-input"
                  />
                  <input
                    v-model="filterEndDate"
                    type="date"
                    class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand focus:border-brand custom-date-input"
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Тип оплаты</label>
                <select
                  v-model="selectedPaymentType"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand focus:border-brand"
                >
                  <option value="cash">Наличная оплата</option>
                  <option value="card">Банковская карта</option>
                  <option value="wallet">Электронный кошелек</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Тип билета</label>
                <select
                  v-model="selectedTicketType"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand focus:border-brand"
                >
                  <option value="single">Разовый</option>
                  <option value="monthly">Месячный</option>
                  <option value="annual">Годовой</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Номер заказа</label>
                <input
                  v-model="orderNumber"
                  type="text"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand focus:border-brand"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Маршрут</label>
                <input
                  v-model="route"
                  type="text"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand focus:border-brand"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Оплата</label>
                <input
                  v-model="payment"
                  type="text"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand focus:border-brand"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Идентификатор операции</label>
                <input
                  v-model="operationId"
                  type="text"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand focus:border-brand"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Код авторизации</label>
                <input
                  v-model="authCode"
                  type="text"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand focus:border-brand"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Сумма</label>
                <input
                  v-model="amount"
                  type="text"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand focus:border-brand"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Статус оплаты</label>
                <select
                  v-model="paymentStatus"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand focus:border-brand"
                >
                  <option value="success">Успешно</option>
                  <option value="failed">Неудачно</option>
                  <option value="pending">В ожидании</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Способ оплаты</label>
                <select
                  v-model="paymentMethod"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand focus:border-brand"
                >
                  <option value="cash">Наличные</option>
                  <option value="card">Карта</option>
                  <option value="wallet">Электронный кошелек</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Карта</label>
                <input
                  v-model="cardNumber"
                  type="text"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand focus:border-brand"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Первые 6 цифр</label>
                <input
                  v-model="firstSixDigits"
                  type="text"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand focus:border-brand"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Последние 4 цифры</label>
                <input
                  v-model="lastFourDigits"
                  type="text"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand focus:border-brand"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Платежная система</label>
                <select
                  v-model="paymentSystem"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand focus:border-brand"
                >
                  <option value="visa">Visa</option>
                  <option value="mastercard">Mastercard</option>
                  <option value="mir">Мир</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Перевозчики</label>
                <select
                  v-model="carrier"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand focus:border-brand"
                >
                  <option value="carrier1">Перевозчик 1</option>
                  <option value="carrier2">Перевозчик 2</option>
                  <option value="carrier3">Перевозчик 3</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Операторы</label>
                <select
                  v-model="operator"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand focus:border-brand"
                >
                  <option value="operator1">Оператор 1</option>
                  <option value="operator2">Оператор 2</option>
                  <option value="operator3">Оператор 3</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">РОС</label>
                <input
                  v-model="ros"
                  type="text"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand focus:border-brand"
                />
              </div>
            </div>
            <!-- Кнопки сохранения и сброса -->
            <div class="flex justify-end space-x-4 mt-6">
              <button
                @click="applyFilters"
                class="px-4 py-2 bg-brand text-white rounded-md hover:bg-brand-dark transition-all duration-300"
              >
                Сохранить
              </button>
              <button
                @click="resetFilters"
                class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-all duration-300"
              >
                Сбросить
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Модальное окно для отправки отчета на email -->
      <div
        v-if="isEmailModalOpen"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
        @click.self="closeEmailModal"
      >
        <div class="bg-white rounded-lg shadow-md w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <h2 class="text-xl font-bold mb-4 text-brand">Отправить отчет</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <input
                  v-model="email"
                  type="email"
                  placeholder="Введите email"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand focus:border-brand"
                />
              </div>
            </div>
            <div class="flex justify-end space-x-4 mt-6">
              <button
                @click="sendReport"
                class="px-4 py-2 bg-brand text-white rounded-md hover:bg-brand-dark transition-all duration-300"
              >
                Отправить
              </button>
              <button
                @click="closeEmailModal"
                class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-all duration-300"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'Import',
  data() {
    return {
      currentTab: 'generate',
      selectedDate: null,
      startDate: null,
      endDate: null,
      isLoading: false,
      reportGenerated: false,
      isFilterModalOpen: false,
      isEmailModalOpen: false,
      email: '',
      filterStartDate: null,
      filterEndDate: null,
      selectedPaymentType: null,
      selectedTicketType: null,
      orderNumber: null,
      route: null,
      payment: null,
      operationId: null,
      authCode: null,
      amount: null,
      paymentStatus: null,
      paymentMethod: null,
      cardNumber: null,
      firstSixDigits: null,
      lastFourDigits: null,
      paymentSystem: null,
      carrier: null,
      operator: null,
      ros: null,
      showScrollToTop: false,
    };
  },
  computed: {
    ...mapState(['reports']),
  },
  methods: {
    ...mapActions(['generateReport', 'deleteReport']),
    async handleGenerateReport() {
      this.isLoading = true;
      this.reportGenerated = false;
      const reportData = {
        date: this.selectedDate || new Date().toISOString().split('T')[0],
        paymentType: this.selectedPaymentType || 'cash',
        ticketType: this.selectedTicketType || 'single',
        orderNumber: this.orderNumber || 'N/A',
        route: this.route || 'N/A',
      };
      try {
        await this.generateReport(reportData); // Вызываем действие Vuex
        this.reportGenerated = true;
      } catch (error) {
        console.error('Ошибка при формировании отчета:', error);
      } finally {
        this.isLoading = false;
      }
    },
    openFilterModal() {
      this.isFilterModalOpen = true;
    },
    closeFilterModal() {
      this.isFilterModalOpen = false;
    },
    openEmailModal() {
      this.isEmailModalOpen = true;
    },
    closeEmailModal() {
      this.isEmailModalOpen = false;
    },
    async sendReport() {
      if (!this.email) {
        alert('Пожалуйста, введите email.');
        return;
      }
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        alert(`Отчет отправлен на ${this.email}`);
        this.closeEmailModal();
      }, 1000);
    },
    applyFilters() {
      this.isFilterModalOpen = false;
    },
    resetFilters() {
      this.filterStartDate = null;
      this.filterEndDate = null;
      this.selectedPaymentType = null;
      this.selectedTicketType = null;
      this.orderNumber = null;
      this.route = null;
    },
    downloadReport(report) {
      alert(`Скачивание отчета: ${report.file}`);
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    handleScroll() {
      this.showScrollToTop = window.scrollY > 200;
    },
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
};
</script>

<style scoped>
/* Анимация загрузки */
.spinner-large {
  border: 6px solid rgba(0, 0, 0, 0.1);
  border-left-color: rgb(234, 29, 146);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Стили для полей даты */
.custom-date-input {
  border-color: rgb(234, 29, 146);
  color: rgb(234, 29, 146);
}

.custom-date-input:focus {
  border-color: rgb(200, 20, 120);
  box-shadow: 0 0 0 3px rgba(234, 29, 146, 0.2);
}

/* Фирменные стили */
.bg-brand {
  background-color: rgb(234, 29, 146);
}

.hover\:bg-brand-dark:hover {
  background-color: rgb(200, 20, 120);
}

.focus\:ring-brand:focus {
  --tw-ring-color: rgb(234, 29, 146);
}

.focus\:border-brand:focus {
  border-color: rgb(234, 29, 146);
}
</style>