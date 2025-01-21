<template>
    <div>
        <canvas ref="chart"></canvas>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export default {
    props: {
        chartData: {
            type: Object,
            required: true
        },
        options: {
            type: Object,
            default: () => ({})
        }
    },
    setup(props) {
        const chart = ref(null)

        onMounted(() => {
            const ctx = chart.value.getContext('2d')
            new Chart(ctx, {
                type: 'line',
                data: props.chartData,
                options: props.options
            })
        })

        return { chart }
    }
}
</script>

<style scoped>
canvas {
    width: 100%;
    height: 300px;
}
</style>