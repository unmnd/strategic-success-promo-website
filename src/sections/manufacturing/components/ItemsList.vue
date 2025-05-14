<template>
    <ul class="space-y-2">
        <li v-for="(item, index) in itemsStandardised" :key="index">
            {{ item.qty }}
            <span class="text-muted-foreground mx-1">×</span>
            <span v-html="ITEM_DEFINITIONS[item.key as keyof typeof ITEM_DEFINITIONS].icon"></span>
            {{ ITEM_DEFINITIONS[item.key as keyof typeof ITEM_DEFINITIONS].name }}
        </li>

        <li v-if="cash">
            <i class="ri-coins-line"></i>
            {{ formatter(cash) }}
        </li>
    </ul>
</template>

<script setup lang="ts">
import { formatter } from '~/utils'
import { ITEM_DEFINITIONS } from '../manufacturing.config'

type Item =
    | {
          key: string
      }
    | {
          itemKey: string
      }

type Quantity =
    | {
          quantity: number
      }
    | {
          qty: number
      }

const props = defineProps<{
    items: (Item & Quantity)[]
    cash?: number
}>()

const itemsStandardised = props.items.map((item) => {
    return {
        key: 'key' in item ? item.key : item.itemKey,
        qty: 'quantity' in item ? item.quantity : item.qty,
    }
})
</script>

<style scoped></style>
