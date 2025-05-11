<template>
    <div class="w-full gap-0 grid-rows-[auto_minmax(0,1fr)_auto]">
        <div class="border-b">
            <div class="flex items-center gap-8 justify-between w-full">
                <div class="flex flex-col items-start">
                    <div class="flex items-center gap-8">
                        <h1 class="text-2xl font-bold">
                            <span v-html="itemDefinition.icon"></span>
                            {{ itemDefinition.name }}
                        </h1>
                        <Badge class="gap-2">
                            <i class="ri-tools-line"></i>
                            {{ itemDevelopmentLevel }}
                        </Badge>
                    </div>

                    <p class="text-muted-foreground font-normal my-4">
                        {{ itemDefinition.description }}
                    </p>
                </div>

                <div class="flex flex-col font-normal items-end justify-between gap-2 h-full">
                    <!-- <UpdateTimer :last-update-timestamp="lastUpdateTimestamp" :update-interval="10000" /> -->

                    <!-- <div class="text-sm text-muted-foreground">
                        Last updated:
                        {{ new Date(lastUpdateTimestamp).toLocaleString() }}
                    </div> -->

                    <Popover>
                        <PopoverTrigger
                            ><Button class="flex items-end gap-2 mb-4 px-2 h-fit">
                                <p class="text-4xl lg:text-5xl tracking-tight">
                                    {{ formatter(itemPrice) }}
                                </p>

                                <div class="flex flex-col items-start justify-center">
                                    <span class="mb-1"> / {{ itemDefinition.unit }} </span>

                                    <Badge
                                        :class="[
                                            percentChange > 0
                                                ? 'bg-green-600 text-white'
                                                : percentChange < 0
                                                  ? 'bg-red-600 text-white'
                                                  : 'bg-muted-foreground text-black border',
                                            'flex items-center gap-1 ml-2 px-2 py-0.5 text-xs font-semibold',
                                        ]"
                                    >
                                        <template v-if="percentChange > 0">
                                            <i class="ri-arrow-up-s-line"></i>
                                            <span>+{{ percentChange.toFixed(2) }}%</span>
                                        </template>
                                        <template v-else-if="percentChange < 0">
                                            <i class="ri-arrow-down-s-line"></i>
                                            <span>{{ percentChange.toFixed(2) }}%</span>
                                        </template>
                                        <template v-else>
                                            <i class="ri-subtract-line"></i>
                                            <span>0.00%</span>
                                        </template>
                                    </Badge>
                                </div>
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent>
                            <div class="flex flex-col gap-2">
                                <div>
                                    Mid Market Price:
                                    <span class="font-bold">{{ formatter(itemPrice) }}</span>
                                </div>

                                <div>
                                    Bid Price:
                                    <span class="font-bold">{{
                                        formatter(highestBuyPrice ?? 0)
                                    }}</span>
                                </div>

                                <div>
                                    Ask Price:
                                    <span class="font-bold">{{
                                        formatter(lowestSellPrice ?? 0)
                                    }}</span>
                                </div>

                                <div>
                                    Last Pr:
                                    <span class="font-bold">{{ formatter(lastPrice) }}</span>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </div>

        <div class="overflow-y-auto flex flex-col gap-4 py-4 pr-2">
            <MarketItemInfoStats :item-key="itemKey" />

            <!-- TODO Move this into main market component, so teams can
                   see all orders for all items at once. Need to move doUpdate
                   and state into separate async market store -->
            <Card class="flex flex-col">
                <CardHeader>
                    <CardTitle>Outstanding Orders</CardTitle>
                </CardHeader>

                <CardContent>
                    <MarketOrderTable
                        :orders="teamOrders"
                        :item-definition="itemDefinition"
                        :allow-remove="true"
                    />
                </CardContent>
            </Card>

            <div class="grid grid-cols-2 gap-4">
                <Card class="flex flex-col">
                    <CardHeader>
                        <CardTitle>Buy</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <MarketOrderPlaceBuy
                            :itemKey="itemKey"
                            :itemPrice="lowestSellPrice ?? itemPrice"
                            :itemDefinition="itemDefinition"
                            :update-counter="lastUpdateTimestamp"
                        />
                    </CardContent>
                </Card>

                <Card class="flex flex-col">
                    <CardHeader>
                        <CardTitle>Sell</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <MarketOrderPlaceSell
                            :itemKey="itemKey"
                            :itemPrice="highestBuyPrice ?? itemPrice"
                            :itemDefinition="itemDefinition"
                            :update-counter="lastUpdateTimestamp"
                        />
                    </CardContent>
                </Card>

                <Card class="flex flex-col">
                    <CardHeader>
                        <CardTitle>Market Depth</CardTitle>
                    </CardHeader>

                    <CardContent class="grow">
                        <MarketItemInfoDepthChart v-if="marketDepth" :data="marketDepth" />
                    </CardContent>
                </Card>

                <Card class="flex flex-col">
                    <CardHeader>
                        <CardTitle>Price History</CardTitle>
                    </CardHeader>

                    <CardContent class="grow">
                        <MarketItemInfoPriceHistoryChart
                            v-if="marketPriceHistory"
                            :data="marketPriceHistory"
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import MarketItemInfoDepthChart from './MarketItemInfoDepthChart.vue'
import MarketItemInfoPriceHistoryChart from './MarketItemInfoPriceHistoryChart.vue'
import MarketItemInfoStats from './MarketItemInfoStats.vue'
import MarketOrderTable from './MarketOrderTable.vue'
import MarketOrderPlaceBuy from './MarketOrderPlaceBuy.vue'
import MarketOrderPlaceSell from './MarketOrderPlaceSell.vue'

import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'

import { Button } from '~/components/ui/button'
import Badge from '~/components/ui/badge/Badge.vue'
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card'
import { colouredIcon, formatter } from '~/utils'
import { useMarketStore } from '../market.store'
import { storeToRefs } from 'pinia'

const itemKey = 'pigmentBlue'

const itemDefinition = {
    name: 'Blue Pigment',
    description: 'A blue pigment used in paint, made from sodium aluminosilicate.',
    unit: 'box',
    icon: colouredIcon('rgb(6 182 212)', 'ri-dropper-line'),
    development: 'raw',
    recipe: {},

    initialMarketParameters: {
        markup: 3800,

        virtualFrequency: 50,
        virtualDrift: 0,
        virtualVolume: 5,
        virtualStandardDeviation: 0.05,
    },
}

const itemDevelopmentLevel = 'Raw Material'

const {
    itemPrice,
    lowestSellPrice,
    highestBuyPrice,
    marketPriceHistory,
    teamOrders,
    lastUpdateTimestamp,
    marketDepth,
    lastPrice,
} = storeToRefs(useMarketStore())

const percentChange = computed(() => {
    return ((itemPrice.value - 3100) / itemPrice.value) * 100
})
</script>

<style></style>
