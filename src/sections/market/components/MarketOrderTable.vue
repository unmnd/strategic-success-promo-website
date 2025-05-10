<template>
    <div v-if="orders.length > 0" class="max-h-[16rem] overflow-y-auto block">
        <Table class="table-fixed">
            <TransitionGroup name="list" tag="tbody">
                <MarketOrderTableItem
                    v-for="(order, index) in orders"
                    :key="index"
                    :order="order"
                    :item-definition="itemDefinition"
                    :allow-remove="allowRemove"
                    @update="$emit('update')"
                />
            </TransitionGroup>
        </Table>
    </div>
    <div v-else class="flex flex-col items-center justify-center w-full h-full pb-8">
        <i class="ri-error-warning-line"></i>
        No orders available
    </div>
</template>

<script setup lang="ts">
import MarketOrderTableItem from './MarketOrderTableItem.vue'

import { Table } from '~/components/ui/table'

defineProps<{
    orders: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
    itemDefinition: any // eslint-disable-line @typescript-eslint/no-explicit-any
    allowRemove: boolean
}>()

defineEmits<{
    (e: 'update'): void
}>()
</script>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}

.list-leave-to,
.list-enter-from {
    opacity: 0;
    transform: translateY(30px);
}

.list-leave-active {
    position: absolute;
}
</style>
