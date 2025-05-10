<template>
    <Card class="pt-6">
        <UpdateTimer
            class="hidden"
            :lastUpdateTimestamp="lastUpdateTimestamp"
            @update="updateStats"
        ></UpdateTimer>

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
import { computed, ref } from 'vue'

import { Card, CardContent } from '~/components/ui/card'

const props = defineProps<{
    itemKey: ItemKey
}>()

const itemKey = props.itemKey

const trend = computed(() => marketStore.trend[itemKey])

const stats = ref(
    await api.game.market.stats.query({
        gameID,
        itemKey,
    }),
)

const lastUpdateTimestamp = ref(Date.now())

async function updateStats() {
    stats.value = await api.game.market.stats.query({
        gameID,
        itemKey,
    })
    lastUpdateTimestamp.value = Date.now()
}
</script>

<style scoped></style>
