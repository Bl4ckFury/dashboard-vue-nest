<template>
    <div class="flex items-center">
        <input v-model="searchQuery" type="text" placeholder="Поиск..."
            class="p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <button @click="handleSearch"
            class="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none">
            Найти
        </button>
    </div>
</template>

<script>
import { ref } from 'vue'

export default {
    setup(_, { emit }) {
        const searchQuery = ref('')

        const handleSearch = () => {
            emit('search', searchQuery.value)
        }

        return {
            searchQuery,
            handleSearch
        }
    }
}
</script>