import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import UsersList from '@/views/ViewUsersList.vue';
import CreateUser from '@/views/ViewCreateUsers.vue';
import CitiesList from '@/views/ViewCitiesList.vue';
import CreateCity from '@/views/ViewCreateCities.vue';
import Import from '@/views/ViewsImport.vue';
import SqlScripts from '@/views/SqlScripts.vue';
import Login from '@/views/Login.vue';
import Analytics from '@/views/Analytics.vue';
import Settings from '@/views/Settings.vue';
import ViewsUserProfile from '@/views/ViewsUserProfile.vue'; // Импортируем новую страницу

const routes = [
  {
    path: '/',
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    component: Login,
    meta: { requiresAuth: false },
  },
  {
    path: '/users/list',
    component: UsersList,
    meta: { requiresAuth: true },
  },
  {
    path: '/users/create',
    component: CreateUser,
    meta: { requiresAuth: true },
  },
  {
    path: '/cities/list',
    component: CitiesList,
    meta: { requiresAuth: true },
  },
  {
    path: '/cities/create',
    component: CreateCity,
    meta: { requiresAuth: true },
  },
  {
    path: '/import',
    component: Import,
    meta: { requiresAuth: true },
  },
  {
    path: '/sql-scripts',
    component: SqlScripts,
    meta: { requiresAuth: true },
  },
  {
    path: '/analytics',
    component: Analytics,
    meta: { requiresAuth: true },
  },
  {
    path: '/settings',
    component: Settings,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile', // Новая страница личного кабинета
    component: ViewsUserProfile,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('access_token') !== null;
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.path === '/login' && isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router;