import { createStore } from 'vuex';

// Восстановление данных из localStorage
const savedState = JSON.parse(localStorage.getItem('appState')) || {
  user: null,
  users: [],
  cities: [],
  reports: [], // Убедимся, что reports инициализирован как массив
  downloadedReports: [], // Добавляем список скачанных отчетов
};

export default createStore({
  state: {
    user: savedState.user,
    isLoading: false,
    users: savedState.users,
    cities: savedState.cities,
    reports: savedState.reports || [], // Убедимся, что reports всегда массив
    downloadedReports: savedState.downloadedReports || [], // Убедимся, что downloadedReports всегда массив
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
      localStorage.setItem('appState', JSON.stringify(state)); // Сохраняем состояние
    },
    SET_LOADING(state, isLoading) {
      state.isLoading = isLoading;
    },
    ADD_USER(state, user) {
      state.users.push(user);
      localStorage.setItem('appState', JSON.stringify(state)); // Сохраняем состояние
    },
    DELETE_USER(state, userId) {
      state.users = state.users.filter((user) => user.id !== userId);
      localStorage.setItem('appState', JSON.stringify(state)); // Сохраняем состояние
    },
    ADD_CITY(state, city) {
      state.cities.push(city);
      localStorage.setItem('appState', JSON.stringify(state)); // Сохраняем состояние
    },
    DELETE_CITY(state, cityId) {
      state.cities = state.cities.filter((city) => city.id !== cityId);
      localStorage.setItem('appState', JSON.stringify(state)); // Сохраняем состояние
    },
    ADD_REPORT(state, report) {
      if (!state.reports) {
        state.reports = []; // Инициализируем reports как массив, если он undefined
      }
      state.reports.push(report);
      localStorage.setItem('appState', JSON.stringify(state)); // Сохраняем состояние
    },
    DELETE_REPORT(state, reportId) {
      state.reports = state.reports.filter((report) => report.id !== reportId);
      localStorage.setItem('appState', JSON.stringify(state)); // Сохраняем состояние
    },
    // Новые мутации для личного кабинета
    SET_USER_EMAIL(state, email) {
      if (state.user) {
        state.user.email = email;
        localStorage.setItem('appState', JSON.stringify(state)); // Сохраняем состояние
      }
    },
    ADD_DOWNLOADED_REPORT(state, report) {
      if (!state.downloadedReports) {
        state.downloadedReports = []; // Инициализируем downloadedReports как массив, если он undefined
      }
      state.downloadedReports.push(report);
      localStorage.setItem('appState', JSON.stringify(state)); // Сохраняем состояние
    },
  },
  actions: {
    async login({ commit }, { username, password }) {
      commit('SET_LOADING', true);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (username === 'admin' && password === 'admin') {
            const user = {
              id: 1,
              name: 'Admin',
              login: 'admin',
              position: 'Administrator',
              permissions: ['view', 'edit', 'delete', 'create_user', 'create_city', 'delete_city', 'sql_scripts'],
              email: '', // Добавляем поле для почты
            };
            localStorage.setItem('access_token', 'fake-access-token');
            commit('SET_USER', user);
            resolve(user);
          } else {
            reject(new Error('Неверный логин или пароль'));
          }
          commit('SET_LOADING', false);
        }, 1000);
      });
    },
    logout({ commit }) {
      localStorage.removeItem('access_token');
      commit('SET_USER', null);
    },
    async createUser({ commit }, user) {
      commit('SET_LOADING', true);
      return new Promise((resolve) => {
        setTimeout(() => {
          commit('ADD_USER', { ...user, id: Date.now() });
          commit('SET_LOADING', false);
          resolve(user);
        }, 1000); // Симуляция задержки сети
      });
    },
    async createCity({ commit }, city) {
      commit('SET_LOADING', true);
      return new Promise((resolve) => {
        setTimeout(() => {
          commit('ADD_CITY', { ...city, id: Date.now() });
          commit('SET_LOADING', false);
          resolve(city);
        }, 1000); // Симуляция задержки сети
      });
    },
    deleteUser({ commit }, userId) {
      commit('DELETE_USER', userId);
    },
    deleteCity({ commit }, cityId) {
      commit('DELETE_CITY', cityId);
    },
    async generateReport({ commit }, reportData) {
      commit('SET_LOADING', true);
      return new Promise((resolve) => {
        setTimeout(() => {
          const report = {
            id: Date.now(),
            ...reportData,
            date: new Date().toLocaleDateString(),
          };
          commit('ADD_REPORT', report);
          commit('SET_LOADING', false);
          resolve(report);
        }, 1000); // Симуляция задержки
      });
    },
    deleteReport({ commit }, reportId) {
      commit('DELETE_REPORT', reportId);
    },
    // Новые действия для личного кабинета
    updateUserEmail({ commit }, email) {
      commit('SET_USER_EMAIL', email);
    },
    addDownloadedReport({ commit }, report) {
      commit('ADD_DOWNLOADED_REPORT', report);
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
    user: (state) => state.user,
    userPermissions: (state) => (state.user ? state.user.permissions : []),
    isLoading: (state) => state.isLoading,
    users: (state) => state.users,
    cities: (state) => state.cities,
    reports: (state) => state.reports || [], // Убедимся, что reports всегда массив
    downloadedReports: (state) => state.downloadedReports || [], // Убедимся, что downloadedReports всегда массив
  },
});