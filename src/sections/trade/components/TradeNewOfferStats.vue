<template>
    <Card class="pt-6">
        <CardContent class="grid grid-cols-6 divide-x text-center gap-2">
            <div class="flex flex-col items-center justify-center h-full">
                <div>Offered Value</div>
                <div class="text-3xl font-extrabold tracking-tight lg:text-5xl">
                    {{ formatString(Math.abs(-totalOfferedValue)) }}
                </div>
            </div>

            <div class="flex flex-col items-center justify-center h-full">
                <div>Offered Market Value</div>
                <div class="text-3xl font-extrabold tracking-tight lg:text-5xl">
                    {{ formatString(Math.abs(marketValueOffered)) }}
                </div>
            </div>

            <div class="flex flex-col items-center justify-center h-full">
                <div>Requested Cost</div>
                <div class="text-3xl font-extrabold tracking-tight lg:text-5xl">
                    {{ formatString(Math.abs(totalRequestedValue)) }}
                </div>
            </div>

            <div class="flex flex-col items-center justify-center h-full">
                <div>Requested Market Cost</div>
                <div class="text-3xl font-extrabold tracking-tight lg:text-5xl">
                    {{ formatString(Math.abs(-marketValueRequested)) }}
                </div>
            </div>

            <div class="flex flex-col items-center justify-center h-full">
                <div>Trade Value</div>
                <div class="text-3xl font-extrabold tracking-tight lg:text-5xl">
                    {{ formatString(Math.abs(-tradeValue)) }}
                </div>
            </div>

            <div class="flex flex-col items-center justify-center h-full">
                <div>Trade Favourability</div>
                <div class="text-3xl font-extrabold tracking-tight lg:text-5xl">
                    {{ Math.abs(tradeFavorabilityPercentage) }}%
                </div>
                <div class="text-muted-foreground text-sm">
                    <span v-if="tradeFavorabilityPercentage > 0">
                        <i class="ri-arrow-down-s-line text-red-500"></i>
                        in their favour
                    </span>

                    <span v-else-if="tradeFavorabilityPercentage < 0">
                        <i class="ri-arrow-up-s-line text-green-400"></i>
                        in your favour
                    </span>

                    <span v-else>
                        <i class="ri-check-line"></i>
                        fair trade
                    </span>
                </div>
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { Card, CardContent } from '~/components/ui/card'
import { formatString } from '~/utils'
import { useTradeStore } from '../trade.store'

const tradeStore = useTradeStore()

const tradeStats = computed(() => tradeStore.calculateTradeStats(tradeStore.pendingTradeOffer))

const totalOfferedValue = computed(() => tradeStats.value.totalOfferedValue)
const totalRequestedValue = computed(() => tradeStats.value.totalRequestedValue)
const marketValueOffered = computed(() => tradeStats.value.marketValueOffered)
const marketValueRequested = computed(() => tradeStats.value.marketValueRequested)
const tradeValue = computed(() => tradeStats.value.tradeValue)
const tradeFavourability = computed(() => tradeStats.value.tradeFavourability)

const tradeFavorabilityPercentage = computed(() => Math.round(tradeFavourability.value * 100))
</script>

<style scoped></style>
