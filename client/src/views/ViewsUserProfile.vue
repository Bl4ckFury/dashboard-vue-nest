<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-8">Личный кабинет</h1>
    <UserProfile :isProfilePage="true" />
  </div>
</template>

<script>
import UserProfile from '@/components/UserProfile.vue'; // Импортируем компонент личного кабинета

export default {
  name: 'ViewsUserProfile',
  components: {
    UserProfile,
  },
};
</script>

<style scoped>
/* Стили для страницы */
</style>