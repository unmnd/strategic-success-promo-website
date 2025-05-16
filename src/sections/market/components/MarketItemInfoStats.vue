<template>
    <Card class="pt-6">
        <CardContent class="grid grid-cols-6 divide-x text-center gap-2">
            <div class="flex flex-col items-center justify-center h-full">
                <div>Items Requested</div>
                <div class="text-3xl font-extrabold tracking-tight lg:text-5xl">
                    {{ stats.buyOrderCount }}
                </div>
            </div>

            <div class="flex flex-col items-center justify-center h-full">
                <div>Items Available</div>
                <div class="text-3xl font-extrabold tracking-tight lg:text-5xl">
                    {{ stats.sellOrderCount }}
                </div>
            </div>

            <div class="flex flex-col items-center justify-center h-full">
                <div>Round Trend</div>
                <div class="text-3xl font-extrabold tracking-tight lg:text-5xl">
                    <i v-if="trend.change < 0" class="ri-arrow-down-line"></i>
                    <i v-else-if="trend.change > 0" class="ri-arrow-up-line"></i>
                    <i v-else class="ri-subtract-line"></i>
                </div>
            </div>

            <div class="flex flex-col items-center justify-center h-full">
                <div>Round Change</div>
                <div class="text-3xl font-extrabold tracking-tight lg:text-5xl">
                    {{ (trend.percent * 100).toFixed(1) }}%
                </div>
            </div>

            <div class="flex flex-col items-center justify-center h-full">
                <div>Round Volume</div>
                <div class="text-3xl font-extrabold tracking-tight lg:text-5xl">
                    {{ formatString(stats.volume) }}
                </div>
            </div>

            <div class="flex flex-col items-center justify-center h-full">
                <div>Cumulative Volume</div>
                <div class="text-3xl font-extrabold tracking-tight lg:text-5xl">
                    {{ formatString(stats.totalVolume) }}
                </div>
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { Card, CardContent } from '~/components/ui/card'
import { useMarketStore } from '../market.store'
import { formatString } from '~/utils'

const marketStore = useMarketStore()

const volume = ref(marketStore.itemPrice * 650)
const prevVolume = marketStore.itemPrice * 3320

watch(
    () => marketStore.itemPrice,
    (newPrice) => {
        const volChange = Math.ceil(Math.random() * 20) * newPrice

        volume.value += volChange
    },
)

const stats = computed(() => {
    const buyOrderCount = marketStore.marketDepth.buy.reduce(
        (acc, order) => acc + order.quantity,
        0,
    )
    const sellOrderCount = marketStore.marketDepth.sell.reduce(
        (acc, order) => acc + order.quantity,
        0,
    )

    return {
        buyOrderCount,
        sellOrderCount,
        volume: volume.value,
        totalVolume: prevVolume + volume.value,
    }
})

const trend = computed(() => {
    const change = marketStore.itemPrice - 3100
    return {
        change,
        percent: change / marketStore.itemPrice,
    }
})
</script>

<style scoped></style>
