<template>
  <LineChart
    v-if="chartData.length > 1"
    index="index"
    :data="chartData"
    :categories="['price']"
    :curve-type="CurveType.Basis"
    :y-formatter="(tick: number) => formatter(tick)"
    :x-formatter="(tick: number) => `Point ${tick + 1}`"
    :y-domain="domain"
    :custom-tooltip="MarketItemInfoPriceHistoryChartTooltip"
  />
  <div v-else class="flex flex-col items-center justify-center w-full h-full pb-8">
    <i class="ri-error-warning-line"></i>
    No data available
  </div>
</template>

<script setup lang="ts">
import { CurveType } from '@unovis/ts'
import { computed, ref, watch } from 'vue'

import MarketItemInfoPriceHistoryChartTooltip from './MarketItemInfoPriceHistoryChartTooltip.vue'

import { formatter } from '~/utils'
import LineChart from './LineChart.vue'

const props = defineProps<{
  data: number[]
}>()

const DOMAIN_PERCENT = 0.1
function computeDomain(data: number[]): [number, number] {
  if (!data.length) return [0, 100]

  const currentPrice = data[0] ?? 0
  const minPrice = Math.min(...data)
  const maxPrice = Math.max(...data)
  const priceOffset = currentPrice * DOMAIN_PERCENT

  return [minPrice - priceOffset, maxPrice + priceOffset]
}

const domain = ref<[number, number]>(computeDomain(props.data))

watch(
  () => props.data,
  (newData) => {
    if (!newData.length) return

    // If new price is outside the domain, update the domain
    const currentPrice = newData[0] ?? 0

    if (currentPrice < domain.value[0] || currentPrice > domain.value[1]) {
      domain.value = computeDomain(newData)
    }
  },
)

// Only do smoothing if we have enough data points
// const shouldSmooth = computed(() => props.data.length > 3)
const shouldSmooth = ref(false)
const windowSize = computed(() => Math.max(1, Math.floor(props.data.length / 20) + 1))

const smoothedData = computed(() => {
  if (!props.data.length) return []
  if (!shouldSmooth.value) return [...props.data]

  // Create a new array to store the smoothed prices
  const smoothed = [...props.data]

  // Loop through the array and apply the moving average
  for (let i = 0; i < props.data.length; i++) {
    let sum = 0
    let count = 0

    // Calculate the moving average within the window
    for (
      let j = Math.max(0, i - windowSize.value);
      j <= Math.min(props.data.length - 1, i + windowSize.value);
      j++
    ) {
      sum += props.data[j]
      count++
    }

    // Set the smoothed price
    smoothed[i] = sum / count
  }

  return smoothed
})

const chartData = computed(() => {
  // Map each price to an object with price and index properties
  return smoothedData.value.map((price, index) => ({
    price,
    index,
  }))
})
</script>

<style scoped></style>
