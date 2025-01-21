<template>
    <div class="min-h-screen p-8 bg-white">
        <h1 class="text-3xl font-bold mb-8 text-gray-800">Аналитика оплаты проезда</h1>

        <!-- Фильтры: перевозчики, подразделения и терминалы -->
        <div class="mb-8">
            <h2 class="text-xl font-semibold mb-4 text-gray-700">Фильтры</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Фильтр по перевозчикам -->
                <div>
                    <label for="carrier" class="block text-sm font-medium text-gray-600">Перевозчик</label>
                    <select id="carrier" v-model="selectedCarrier"
                        class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand focus:border-brand cursor-pointer transition-all duration-300 hover:border-brand">
                        <option v-for="carrier in carriers" :key="carrier.id" :value="carrier.id">
                            {{ carrier.name }}
                        </option>
                    </select>
                </div>

                <!-- Фильтр по подразделениям -->
                <div>
                    <label for="department" class="block text-sm font-medium text-gray-600">Подразделение</label>
                    <select id="department" v-model="selectedDepartment"
                        class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand focus:border-brand cursor-pointer transition-all duration-300 hover:border-brand">
                        <option v-for="department in departments" :key="department.id" :value="department.id">
                            {{ department.name }}
                        </option>
                    </select>
                </div>

                <!-- Фильтр по терминалам -->
                <div>
                    <label for="terminal" class="block text-sm font-medium text-gray-600">Терминал</label>
                    <select id="terminal" v-model="selectedTerminal"
                        class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand focus:border-brand cursor-pointer transition-all duration-300 hover:border-brand">
                        <option v-for="terminal in terminals" :key="terminal.id" :value="terminal.id">
                            {{ terminal.name }}
                        </option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Выбор периода по дате -->
        <div class="mb-8">
            <h2 class="text-xl font-semibold mb-4 text-gray-700">Выберите период</h2>
            <div class="flex space-x-4">
                <div class="flex-1">
                    <label for="startDate" class="block text-sm font-medium text-gray-600">Начальная дата</label>
                    <input type="date" id="startDate" v-model="startDate"
                        class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand focus:border-brand cursor-pointer transition-all duration-300 hover:border-brand" />
                </div>
                <div class="flex-1">
                    <label for="endDate" class="block text-sm font-medium text-gray-600">Конечная дата</label>
                    <input type="date" id="endDate" v-model="endDate"
                        class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand focus:border-brand cursor-pointer transition-all duration-300 hover:border-brand" />
                </div>
            </div>
        </div>

        <!-- Диаграммы -->
        <div class="grid grid-cols-1 gap-6">
            <!-- Столбчатая диаграмма -->
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h2 class="text-xl font-semibold mb-4 text-gray-700">Оплата проезда</h2>

                <!-- Переключение между суммой и количеством -->
                <div class="mb-4">
                    <h2 class="text-lg font-semibold mb-2 text-gray-600">Отображение данных</h2>
                    <div class="flex space-x-4">
                        <button @click="setBarDisplayMode('amount')" :class="{
                            'bg-brand text-white hover:bg-brand-dark': barDisplayMode === 'amount',
                            'bg-gray-200 text-gray-700 hover:bg-gray-300': barDisplayMode !== 'amount'
                        }" class="px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer">
                            Сумма
                        </button>
                        <button @click="setBarDisplayMode('count')" :class="{
                            'bg-brand text-white hover:bg-brand-dark': barDisplayMode === 'count',
                            'bg-gray-200 text-gray-700 hover:bg-gray-300': barDisplayMode !== 'count'
                        }" class="px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer">
                            Количество
                        </button>
                    </div>
                </div>

                <!-- Диаграмма -->
                <div class="chart-container">
                    <canvas ref="barChart"></canvas>
                </div>

                <!-- Фильтры вариантов оплаты -->
                <div class="mt-8">
                    <h2 class="text-lg font-semibold mb-2 text-gray-600">Тип оплаты</h2>
                    <div class="flex flex-wrap gap-4">
                        <label v-for="option in paymentOptions" :key="option.value"
                            class="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" v-model="selectedBarPaymentTypes" :value="option.value"
                                class="form-checkbox h-5 w-5 rounded border-gray-300 cursor-pointer" :style="{
                                    backgroundColor: selectedBarPaymentTypes.includes(option.value) ? getColor(option.value) : 'white',
                                    borderColor: getColor(option.value)
                                }" />
                            <span class="text-gray-700">{{ option.label }}</span>
                        </label>
                    </div>
                </div>
            </div>

            <!-- Круговая диаграмма -->
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h2 class="text-xl font-semibold mb-4 text-gray-700">Транзакции</h2>

                <!-- Переключение между суммой и количеством -->
                <div class="mb-4">
                    <h2 class="text-lg font-semibold mb-2 text-gray-600">Отображение данных</h2>
                    <div class="flex space-x-4">
                        <button @click="setPieDisplayMode('amount')" :class="{
                            'bg-brand text-white hover:bg-brand-dark': pieDisplayMode === 'amount',
                            'bg-gray-200 text-gray-700 hover:bg-gray-300': pieDisplayMode !== 'amount'
                        }" class="px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer">
                            Сумма
                        </button>
                        <button @click="setPieDisplayMode('count')" :class="{
                            'bg-brand text-white hover:bg-brand-dark': pieDisplayMode === 'count',
                            'bg-gray-200 text-gray-700 hover:bg-gray-300': pieDisplayMode !== 'count'
                        }" class="px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer">
                            Количество
                        </button>
                    </div>
                </div>

                <!-- Диаграмма -->
                <div class="chart-container">
                    <canvas ref="pieChart"></canvas>
                </div>

                <!-- Фильтры вариантов оплаты -->
                <div class="mt-8">
                    <h2 class="text-lg font-semibold mb-2 text-gray-600">Тип оплаты</h2>
                    <div class="flex flex-wrap gap-4">
                        <label v-for="option in paymentOptions" :key="option.value"
                            class="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" v-model="selectedPiePaymentTypes" :value="option.value"
                                class="form-checkbox h-5 w-5 rounded border-gray-300 cursor-pointer" :style="{
                                    backgroundColor: selectedPiePaymentTypes.includes(option.value) ? getColor(option.value) : 'white',
                                    borderColor: getColor(option.value)
                                }" />
                            <span class="text-gray-700">{{ option.label }}</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { Chart, BarController, CategoryScale, LinearScale, BarElement, PieController, ArcElement, Tooltip } from 'chart.js';

// Регистрация необходимых компонентов
Chart.register(BarController, CategoryScale, LinearScale, BarElement, PieController, ArcElement, Tooltip);

export default {
    setup() {
        // Данные для фильтров
        const carriers = ref([
            { id: 1, name: 'Перевозчик 1' },
            { id: 2, name: 'Перевозчик 2' },
            { id: 3, name: 'Перевозчик 3' }
        ]);

        const departments = ref([
            {
                id: 1, name: 'Подразделение 1', terminals: [
                    { id: 1, name: 'Терминал A1' },
                    { id: 2, name: 'Терминал A2' }
                ]
            },
            {
                id: 2, name: 'Подразделение 2', terminals: [
                    { id: 3, name: 'Терминал B1' },
                    { id: 4, name: 'Терминал B2' }
                ]
            },
            {
                id: 3, name: 'Подразделение 3', terminals: [
                    { id: 5, name: 'Терминал C1' },
                    { id: 6, name: 'Терминал C2' }
                ]
            }
        ]);

        // Выбранные значения фильтров
        const selectedCarrier = ref(carriers.value[0].id);
        const selectedDepartment = ref(departments.value[0].id);
        const selectedTerminal = ref(departments.value[0].terminals[0].id);

        // Список терминалов для выбранного подразделения
        const terminals = computed(() => {
            const department = departments.value.find(d => d.id === selectedDepartment.value);
            return department ? department.terminals : [];
        });

        // Обновление терминала при выборе подразделения
        watch(selectedDepartment, (newDepartmentId) => {
            const department = departments.value.find(d => d.id === newDepartmentId);
            if (department && department.terminals.length > 0) {
                selectedTerminal.value = department.terminals[0].id;
            }
        });

        // Остальной код компонента (типы оплаты, диаграммы и т.д.)
        const paymentOptions = [
            { value: 'Электронный кошелек', label: 'Электронный кошелек' },
            { value: 'Наличная оплата', label: 'Наличная оплата' },
            { value: 'Банковские карты', label: 'Банковские карты' },
            { value: 'Транспортные карты', label: 'Транспортные карты' },
            { value: 'QR-оплата', label: 'QR-оплата' }
        ];

        const selectedBarPaymentTypes = ref(paymentOptions.map((opt) => opt.value));
        const selectedPiePaymentTypes = ref(paymentOptions.map((opt) => opt.value));
        const barDisplayMode = ref('amount');
        const pieDisplayMode = ref('amount');
        const startDate = ref('');
        const endDate = ref('');

        const paymentColors = {
            'Электронный кошелек': 'rgba(234, 29, 146, 0.6)',
            'Наличная оплата': 'rgba(66, 165, 245, 0.6)',
            'Банковские карты': 'rgba(102, 187, 106, 0.6)',
            'Транспортные карты': 'rgba(255, 193, 7, 0.6)',
            'QR-оплата': 'rgba(156, 39, 176, 0.6)'
        };

        const getColor = (paymentType) => {
            return paymentColors[paymentType] || 'gray';
        };

        const paymentData = {
            labels: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
            datasets: [
                {
                    label: 'Электронный кошелек',
                    data: [12000, 15000, 18000, 20000, 22000, 25000, 27000, 28000, 29000, 30000, 31000, 32000],
                    backgroundColor: paymentColors['Электронный кошелек']
                },
                {
                    label: 'Наличная оплата',
                    data: [8000, 9000, 10000, 11000, 12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000],
                    backgroundColor: paymentColors['Наличная оплата']
                },
                {
                    label: 'Банковские карты',
                    data: [10000, 11000, 12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000, 20000, 21000],
                    backgroundColor: paymentColors['Банковские карты']
                },
                {
                    label: 'Транспортные карты',
                    data: [5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000, 13000, 14000, 15000, 16000],
                    backgroundColor: paymentColors['Транспортные карты']
                },
                {
                    label: 'QR-оплата',
                    data: [3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000, 13000, 14000],
                    backgroundColor: paymentColors['QR-оплата']
                }
            ]
        };

        const transactionsData = {
            labels: ['Электронный кошелек', 'Наличная оплата', 'Банковские карты', 'Транспортные карты', 'QR-оплата'],
            datasets: [
                {
                    data: [120, 80, 100, 50, 30],
                    backgroundColor: [
                        paymentColors['Электронный кошелек'],
                        paymentColors['Наличная оплата'],
                        paymentColors['Банковские карты'],
                        paymentColors['Транспортные карты'],
                        paymentColors['QR-оплата']
                    ]
                }
            ]
        };

        const filteredBarData = computed(() => {
            return {
                labels: paymentData.labels,
                datasets: paymentData.datasets.filter((dataset) =>
                    selectedBarPaymentTypes.value.includes(dataset.label)
                )
            };
        });

        const filteredPieData = computed(() => {
            return {
                labels: transactionsData.labels.filter((label) =>
                    selectedPiePaymentTypes.value.includes(label)
                ),
                datasets: [
                    {
                        data: transactionsData.datasets[0].data.filter((value, index) =>
                            selectedPiePaymentTypes.value.includes(transactionsData.labels[index])
                        ),
                        backgroundColor: transactionsData.datasets[0].backgroundColor.filter((color, index) =>
                            selectedPiePaymentTypes.value.includes(transactionsData.labels[index])
                        )
                    }
                ]
            };
        });

        const barChartData = computed(() => {
            return {
                labels: filteredBarData.value.labels,
                datasets: filteredBarData.value.datasets.map((dataset) => ({
                    ...dataset,
                    data: barDisplayMode.value === 'amount' ? dataset.data : dataset.data.map((value) => value / 100)
                }))
            };
        });

        const pieChartData = computed(() => {
            return {
                labels: filteredPieData.value.labels,
                datasets: [
                    {
                        ...filteredPieData.value.datasets[0],
                        data: pieDisplayMode.value === 'amount' ? filteredPieData.value.datasets[0].data : filteredPieData.value.datasets[0].data.map((value) => value / 10)
                    }
                ]
            };
        });

        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                },
                x: {
                    ticks: {
                        autoSkip: false,
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            },
            plugins: {
                tooltip: {
                    enabled: true,
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function (context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== undefined) {
                                label += context.parsed.y.toLocaleString();
                            } else if (context.raw !== undefined) {
                                label += context.raw.toLocaleString();
                            }
                            return label;
                        }
                    }
                }
            }
        };

        const pieChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    enabled: true,
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function (context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed !== undefined) {
                                label += context.parsed.toLocaleString();
                            } else if (context.raw !== undefined) {
                                label += context.raw.toLocaleString();
                            }
                            return label;
                        }
                    }
                }
            }
        };

        const setBarDisplayMode = (mode) => {
            barDisplayMode.value = mode;
        };

        const setPieDisplayMode = (mode) => {
            pieDisplayMode.value = mode;
        };

        const barChart = ref(null);
        const pieChart = ref(null);
        let barChartInstance = null;
        let pieChartInstance = null;

        onMounted(() => {
            try {
                if (barChart.value && pieChart.value) {
                    const barCtx = barChart.value.getContext('2d');
                    const pieCtx = pieChart.value.getContext('2d');

                    barChartInstance = new Chart(barCtx, {
                        type: 'bar',
                        data: barChartData.value,
                        options: chartOptions
                    });

                    pieChartInstance = new Chart(pieCtx, {
                        type: 'pie',
                        data: pieChartData.value,
                        options: pieChartOptions
                    });
                } else {
                    console.error('Элементы <canvas> не найдены в DOM');
                }
            } catch (error) {
                console.error('Ошибка при создании диаграмм:', error);
            }
        });

        watch([barChartData, pieChartData], () => {
            if (barChartInstance) {
                barChartInstance.data = barChartData.value;
                barChartInstance.update();
            }

            if (pieChartInstance) {
                pieChartInstance.data = pieChartData.value;
                pieChartInstance.update();
            }
        });

        return {
            carriers,
            departments,
            selectedCarrier,
            selectedDepartment,
            selectedTerminal,
            terminals,
            paymentOptions,
            selectedBarPaymentTypes,
            selectedPiePaymentTypes,
            barDisplayMode,
            pieDisplayMode,
            startDate,
            endDate,
            barChartData,
            pieChartData,
            chartOptions,
            setBarDisplayMode,
            setPieDisplayMode,
            getColor,
            barChart,
            pieChart
        };
    }
};
</script>

<style scoped>
.chart-container {
    position: relative;
    width: 100%;
    height: 400px;
}

.focus\:ring-brand:focus {
    --tw-ring-color: rgb(234, 29, 146);
}

.focus\:border-brand:focus {
    border-color: rgb(234, 29, 146);
}

.hover\:border-brand:hover {
    border-color: rgb(234, 29, 146);
}

button {
    cursor: pointer;
}

input[type="date"] {
    cursor: pointer;
}

.bg-brand {
    background-color: rgb(234, 29, 146);
}

.bg-brand-dark {
    background-color: rgb(200, 20, 120);
}

.hover\:bg-brand-dark:hover {
    background-color: rgb(200, 20, 120);
}

.form-checkbox {
    appearance: none;
    border: 2px solid;
    transition: background-color 0.2s, border-color 0.2s;
}

.form-checkbox:checked {
    background-color: inherit;
    border-color: inherit;
}
</style>