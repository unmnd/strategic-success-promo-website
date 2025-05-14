<template>
    <TableRow class="group">
        <TableCell>
            <span>
                <span v-html="order.icon"></span>
                {{ order.reference }}
            </span>
        </TableCell>

        <!-- Inputs -->
        <TableCell>
            <div class="flex flex-wrap gap-2 items-center">
                <ItemsList :items="inputs" :cash="order.cash < 0 ? -order.cash : undefined" />
            </div>
        </TableCell>

        <!-- Outputs -->
        <TableCell>
            <div class="flex flex-wrap gap-2 items-center">
                <i class="ri-arrow-right-line text-muted-foreground"></i>

                <ItemsList :items="outputs" :cash="order.cash > 0 ? order.cash : undefined" />
            </div>
        </TableCell>
        <TableCell class="text-right w-0 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            <AlertDialog :open="showDialog" @update:open="showDialog = $event">
                <AlertDialogTrigger>
                    <Button variant="outline" class="gap-2">
                        {{ isAvailableOrder ? 'Order' : 'Remove' }}
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent v-if="isAvailableOrder">
                    <Suspense>
                        <ManufacturingAvailableOrdersItemPlace
                            v-if="showDialog"
                            @close="showDialog = false"
                            :order="(() => order)()"
                        />
                    </Suspense>
                </AlertDialogContent>
            </AlertDialog>
        </TableCell>
    </TableRow>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import ManufacturingAvailableOrdersItemPlace from './ManufacturingAvailableOrdersItemPlace.vue'
import ItemsList from './ItemsList.vue'

import { TableCell, TableRow } from '~/components/ui/table'
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from '~/components/ui/alert-dialog'
import { Button } from '~/components/ui/button'

const props = defineProps<{
    order: {
        key: string
        reference: string
        icon: string
        placedOrderNumbers: number[]
        inputs: { key: string; quantity: number }[]
        outputs: { item: { key: string; quality: number }; quantity: number }[]
        cash: number
    }
    idx?: number
}>()

const isAvailableOrder = computed(() => 'key' in props.order)

const inputItems = props.order.inputs.reduce(
    (acc, item) => {
        if ('quantity' in item) {
            acc[item.key] = (acc[item.key] ?? 0) + item.quantity
        }

        return acc
    },
    {} as Record<string, number>,
)
const inputs = computed(() => Object.entries(inputItems).map(([key, qty]) => ({ key, qty })))

const outputItems = props.order.outputs.reduce(
    (acc, item) => {
        if ('quantity' in item) {
            acc[item.item.key] = (acc[item.item.key] ?? 0) + item.quantity
        }

        return acc
    },
    {} as Record<string, number>,
)
const outputs = computed(() => Object.entries(outputItems).map(([key, qty]) => ({ key, qty })))

const showDialog = ref(false)
</script>

<style scoped></style>
