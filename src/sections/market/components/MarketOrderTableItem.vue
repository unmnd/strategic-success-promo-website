<template>
  <TableRow class="text-base">
    <TableCell>
      <Badge
        class="uppercase"
        :variant="isBuy ? 'default' : 'secondary'"
        :class="isBuy ? '' : 'bg-emerald-400 text-black'"
      >
        {{ isBuy ? 'Buy' : 'Sell' }}
      </Badge>
    </TableCell>

    <TableCell class="text-center">
      {{ itemDefinition.name }}
    </TableCell>

    <TableCell class="text-center">
      {{ quantity }}
      <span class="text-muted-foreground">{{ pluralise(itemDefinition.unit, quantity) }}</span>
    </TableCell>

    <TableCell class="text-center">
      {{ formatter(price) }} <span class="text-muted-foreground"> each </span>
    </TableCell>

    <TableCell class="text-center">
      {{ formatter(price * quantity) }} <span class="text-muted-foreground"> total </span>
    </TableCell>

    <TableCell class="text-right">
      <Button v-if="!removingOrder" variant="outline" @click="removeOrder(order)"> Remove </Button>
    </TableCell>
  </TableRow>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import pluralise from 'pluralize'

import { TableRow, TableCell } from '~/components/ui/table'
import { Badge } from '~/components/ui/badge'
import { formatter } from '~/utils'
import { Button } from '~/components/ui/button'

import { useMarketStore } from '../market.store'
import { storeToRefs } from 'pinia'

const props = withDefaults(
  defineProps<{
    order: any // eslint-disable-line @typescript-eslint/no-explicit-any
    itemDefinition: any // eslint-disable-line @typescript-eslint/no-explicit-any
    allowRemove: boolean
  }>(),
  {
    allowRemove: true,
  },
)

defineEmits<{
  (e: 'update'): void
}>()

const isBuy = computed(() => {
  return 'buyer' in props.order
})

const quantity = computed(() => {
  return 'buyer' in props.order ? props.order.quantity : props.order.items.length
})

const price = computed(() => {
  return 'buyer' in props.order ? props.order.maxPrice : props.order.price
})

const removingOrder = ref(false)

const { teamOrders } = storeToRefs(useMarketStore())

async function removeOrder(
  order: any, // eslint-disable-line @typescript-eslint/no-explicit-any
) {
  teamOrders.value = teamOrders.value.filter(
    (
      o: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    ) => o !== order,
  )
}
</script>

<style scoped></style>
