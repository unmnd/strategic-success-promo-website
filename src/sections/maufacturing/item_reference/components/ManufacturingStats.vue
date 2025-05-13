<template>
    <div class="grid grid-cols-3 divide-x text-center">
        <div class="flex flex-col items-center px-4">
            <div>Projected Item Increase</div>
            <div class="text-3xl font-extrabold tracking-tight lg:text-5xl">
                {{ itemChange }}
            </div>
        </div>

        <div class="flex flex-col items-center px-4">
            <div>Projected Warehouse Free Space</div>
            <div class="text-3xl font-extrabold tracking-tight lg:text-5xl">
                {{ warehouseSpaceAfterChange }}
            </div>
        </div>

        <div class="flex flex-col items-center px-4">
            <div>Total Cost of Pending Orders</div>
            <div class="text-3xl font-extrabold tracking-tight lg:text-5xl">
                {{ formatString(totalCostOfPendingOrder) }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { formatString } from '~/app.utils'
import { useItemStore } from '~/modules/item/item.store'

const itemStore = (await useItemStore)()

const totalInputItems = computed(() => {
    return itemStore.itemOrders.reduce((sum, order) => {
        return sum + order.inputs.length
    }, 0)
})

const totalOutputItems = computed(() => {
    return itemStore.itemOrders.reduce((sum, order) => {
        return sum + order.outputs.length
    }, 0)
})

const itemChange = computed(() => {
    return totalOutputItems.value - totalInputItems.value
})

const warehouseSpaceAfterChange = computed(() => {
    return itemStore.warehouseCapacity - itemStore.itemCount - itemChange.value
})

const totalCostOfPendingOrder = computed(() => {
    return itemStore.itemOrders.reduce((sum, order) => {
        return sum + order.cash
    }, 0)
})
</script>

<style scoped></style>
