<template>
  <div>
    <h1 class="text-3xl font-bold mb-8">Добро пожаловать, {{ user?.name || 'Гость' }}!</h1>
    <div v-if="hasPermission('view')">
      <PaymentCharts />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import PaymentCharts from '@/components/PaymentCharts.vue'; // Импортируем компонент с графиками

export default {
  components: {
    PaymentCharts,
  },
  computed: {
    ...mapGetters(['user', 'userPermissions']), // Используем геттер user
  },
  methods: {
    hasPermission(permission) {
      return this.userPermissions.includes(permission);
    },
  },
};
</script>

<style>
/* Стили для главной страницы */
</style>