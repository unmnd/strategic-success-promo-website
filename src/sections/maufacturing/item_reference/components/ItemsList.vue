<template>
    <ul class="space-y-2">
        <li v-for="(item, index) in itemsStandardised" :key="index">
            {{ item.qty }}
            <span class="text-muted-foreground mx-1">×</span>
            <span v-html="itemStore.itemDefinitions[item.key].icon"></span>
            {{ itemStore.itemDefinitions[item.key].name }}
        </li>

        <li v-if="cash">
            <i class="ri-coins-line"></i>
            {{ formatter(cash) }}
        </li>
    </ul>
</template>

<script setup lang="ts">
import type { Amount } from '@/game/bank/bank.interface'
import type { ItemKey } from '@/game/item/item.interface.base'
import { formatter } from '~/app.utils'
import { useItemStore } from '~/modules/item/item.store'

const itemStore = (await useItemStore)()

type Item =
    | {
          key: ItemKey
      }
    | {
          itemKey: ItemKey
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
    cash?: Amount
}>()

const itemsStandardised = props.items.map((item) => {
    return {
        key: 'key' in item ? item.key : item.itemKey,
        qty: 'quantity' in item ? item.quantity : item.qty,
    }
})
</script>

<style scoped></style>
