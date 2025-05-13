<template>
    <div class="flex flex-col h-4 rounded-full relative gap-4 border">
        <!-- Hover item bar -->
        <div
            class="absolute top-0 left-0 h-full rounded-full bg-green-400 transition-all"
            :class="hoverItemNonzero ? 'opacity-100' : 'opacity-0'"
            :style="{
                width: percentageHoverItem * 100 + '%',
                left: percentageOffsetHoverItem * 100 + '%',
            }"
        ></div>

        <!-- Warehouse full bar -->
        <div
            class="flex h-full rounded-full bg-primary transition-colors"
            :class="{
                'bg-red-500': percentageFull > 0.9 && !hoverItemNonzero,
                'bg-primary-foreground': hoverItemNonzero,
            }"
            :style="{ width: percentageFull * 100 + '%' }"
        ></div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { ItemKey } from '@/game/item/item.interface'
import { useItemStore } from '~/modules/item/item.store'

const itemStore = (await useItemStore)()

const hoverItemQuantity = computed(
    () => itemStore.itemCounts[itemStore.hoverItem as ItemKey]?.quantity ?? 0,
)

const hoverItemNonzero = computed(() =>
    itemStore.hoverItem && hoverItemQuantity.value > 0 ? itemStore.hoverItem : undefined,
)

const percentageFull = computed(() => {
    return itemStore.itemCount / itemStore.warehouseCapacity
})

const percentageHoverItem = computed(() => {
    return hoverItemQuantity.value / itemStore.warehouseCapacity
})

const percentageOffsetHoverItem = computed(() => {
    // Find the index of the hover item in the sorted item counts
    const index = itemStore.sortedItemCounts.findIndex(
        (item) => item.key === hoverItemNonzero.value,
    )

    // If the hover item is not in the sorted item counts, return 0
    if (index === -1) return 0

    // Get the cumulative sum of the item counts before the hover item
    const cumulativeSum = itemStore.sortedItemCounts.slice(0, index).reduce((acc, item) => {
        return acc + item.quantity
    }, 0)

    // Calculate the percentage offset
    return cumulativeSum / itemStore.warehouseCapacity
})
</script>

<style scoped></style>
