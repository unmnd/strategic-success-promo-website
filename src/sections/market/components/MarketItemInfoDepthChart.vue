<template>
  <BarChart
    v-if="prices.length > 0"
    index="price"
    :data="data"
    :categories="['buy', 'sell']"
    :x-formatter="
      (tick) => {
        return typeof tick === 'number' ? formatter(prices[tick]) : ''
      }
    "
    :type="'stacked'"
    :custom-tooltip="MarketItemInfoDepthChartTooltip"
  />
  <div v-else class="flex flex-col items-center justify-center w-full h-full pb-8">
    <i class="ri-error-warning-line"></i>
    No data available
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import MarketItemInfoDepthChartTooltip from './MarketItemInfoDepthChartTooltip.vue'

import BarChart from './BarChart.vue'
import { formatter } from '~/utils'

const props = defineProps<{
  data: MarketDepth
}>()

// Extract data
const buyPrices = computed(() => props.data.buy.map((order) => order.price))
const sellPrices = computed(() => props.data.sell.map((order) => order.price))

// Merge buy and sell prices for x-axis, sorted in ascending order
const prices = computed(() =>
  [...new Set([...buyPrices.value, ...sellPrices.value])].sort((a, b) => a - b),
)

const data = computed(() =>
  prices.value.map((price) => {
    return {
      price,
      buy: props.data.buy.find((order) => order.price === price)?.quantity || 0,
      sell: props.data.sell.find((order) => order.price === price)?.quantity || 0,
    }
  }),
)
</script>

<style scoped></style>
