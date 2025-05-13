<template>
    <div class="grid grid-cols-3 divide-x text-center">
        <div class="flex flex-col items-center px-4">
            <div>Total Items</div>
            <div class="text-3xl font-extrabold tracking-tight lg:text-5xl">
                {{ itemStore.itemCount }}
            </div>
        </div>

        <div class="flex flex-col items-center px-4">
            <div>Capacity</div>
            <div class="text-3xl font-extrabold tracking-tight lg:text-5xl">
                {{ itemStore.warehouseCapacity }}
            </div>
        </div>

        <div class="flex flex-col items-center px-4">
            <div>Value</div>
            <div class="text-3xl font-extrabold tracking-tight lg:text-5xl">
                {{ formatString(itemStore.totalValue) }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { formatString } from '~/app.utils'
import { useItemStore } from '~/modules/item/item.store'

const itemStore = (await useItemStore)()
</script>

<style scoped></style>
