<template>
    <TableRow class="group">
        <TableCell v-if="!isAvailableOrder">
            <!-- group-hover:max-h-[88px] h-[88px] transition-all  -->
            <div class="overflow-clip max-h-10 flex items-center">
                <div
                    class="group-hover:flex hidden flex-col items-center justify-center gap-2 w-10"
                >
                    <Button
                        :disabled="idx === 0 || movingOrder"
                        variant="outline"
                        class="w-10"
                        @click="moveOrder(-(idx ?? 0))"
                    >
                        <i v-if="!movingOrder" class="ri-arrow-drop-up-line"></i>
                        <span v-else>
                            <LoadingSpinner />
                        </span>
                    </Button>
                    <!--
                    <Button
                        :disabled="idx === itemStore.itemOrders.length - 1"
                        variant="outline"
                        class="w-10"
                        @click="moveOrder(1)"
                    >
                        <i class="ri-arrow-drop-down-line"></i>
                    </Button> -->
                </div>

                <span
                    class="font-bold text-xl flex w-10 items-center justify-center group-hover:hidden"
                >
                    {{ (idx ?? 0) + 1 }}
                </span>
            </div>
        </TableCell>

        <TableCell>
            <TooltipProvider v-if="'failureReason' in order">
                <Tooltip :delayDuration="0">
                    <TooltipTrigger class="mr-2">
                        <Badge class="bg-red-500 hover:text-foreground hover:bg-background">
                            <i class="ri-error-warning-line mr-1"></i>
                            Failed
                        </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p class="text-red-500">{{ order.failureReason }}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <TooltipProvider v-if="effectsModified">
                <Tooltip :delayDuration="0">
                    <TooltipTrigger class="mr-2">
                        <Badge>
                            <i class="ri-tools-line mr-1"></i>
                            Modified
                        </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p v-for="{ desc, name } in effectsModified" :key="name">
                            <span class="font-bold">{{ name }}:</span> {{ desc }}
                        </p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

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
            <AlertDialog
                :open="showDialog"
                @update:open="showDialog = $event"
                v-if="gameStore.active && !removingOrder"
            >
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
                            :order="(() => order as AvailableItemTransformationOrder)()"
                        />

                        <template #fallback>
                            <div class="flex items-center justify-center w-full gap-2">
                                <LoadingSpinner />
                            </div>
                        </template>
                    </Suspense>
                </AlertDialogContent>
                <AlertDialogContent v-else>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will remove the order from the warehouse so it will not be
                            executed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel @click="showDialog = false">Cancel</AlertDialogCancel>
                        <AlertDialogAction @click="removeOrder()">Remove</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Button v-else-if="removingOrder" disabled variant="outline">
                <span class="flex items-center gap-2">
                    <span class="scale-50">
                        <LoadingSpinner />
                    </span>
                    <span> Removing </span>
                </span>
            </Button>

            <TooltipProvider v-else-if="!gameStore.active">
                <Tooltip :delayDuration="100">
                    <TooltipTrigger class="self-end cursor-default">
                        <Button variant="outline" disabled>
                            {{ isAvailableOrder ? 'Make' : 'Remove' }}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent> Game is not active </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </TableCell>
    </TableRow>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import ManufacturingAvailableOrdersItemPlace from './ManufacturingAvailableOrdersItemPlace.vue'
import ItemsList from './ItemsList.vue'

import type {
    AvailableItemTransformationOrder,
    ItemTransformationOrder,
} from '@/game/item/item.interface'
import { Badge } from '~/components/ui/badge'
import { handleError } from '~/app.utils'
import { TableCell, TableRow } from '~/components/ui/table'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '~/components/ui/alert-dialog'
import { Button } from '~/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip'
import LoadingSpinner from '~/components/LoadingSpinner.vue'
import { api } from '~/modules/api/api.utils'
import { useAuthStore } from '~/modules/auth/auth.store'
import { useGameStore } from '~/modules/team/modules/game/game.store'
import { useEffectStore } from '~/modules/team/modules/effect/effect.store'
import type { ItemKey } from '@/game/item/item.interface.base'

const gameStore = (await useGameStore)()
const effectStore = (await useEffectStore)()
const authStore = useAuthStore()

const gameID = authStore.getUser<'team'>().gameID
const teamID = authStore.getUser<'team'>()._id

const props = defineProps<{
    order: ItemTransformationOrder | AvailableItemTransformationOrder
    idx?: number
}>()

const isAvailableOrder = computed(() => 'key' in props.order)

const effectsModified = computed(() => {
    if (!('effectsModified' in props.order)) {
        return undefined
    }

    const modifications = props.order.effectsModified
        .filter((item) => item.desc) // Remove empty values
        .map((item) => ({
            name: effectStore.effectInfo[item.key].name,
            desc: item.desc,
        })) // Replace key with name

    if (modifications.length === 0) {
        return undefined
    }

    return modifications
})

const inputItems = props.order.inputs.reduce(
    (acc, item) => {
        if ('quantity' in item) {
            acc[item.key] = (acc[item.key] ?? 0) + item.quantity
        } else {
            acc[item.key] = (acc[item.key] ?? 0) + 1
        }

        return acc
    },
    {} as Record<ItemKey, number>,
)
const inputs = computed(() => Object.entries(inputItems).map(([key, qty]) => ({ key, qty })))

const outputItems = props.order.outputs.reduce(
    (acc, item) => {
        if ('quantity' in item) {
            acc[item.item.key] = (acc[item.item.key] ?? 0) + item.quantity
        } else {
            acc[item.key] = (acc[item.key] ?? 0) + 1
        }

        return acc
    },
    {} as Record<ItemKey, number>,
)
const outputs = computed(() => Object.entries(outputItems).map(([key, qty]) => ({ key, qty })))

const removingOrder = ref(false)
const showDialog = ref(false)

async function removeOrder() {
    removingOrder.value = true
    try {
        if (!('orderNumber' in props.order)) {
            throw new Error('Missing order number from item removal')
        }

        await api.game.warehouse.itemOrders.delete.mutate({
            gameID,
            teamID,
            orderNumber: props.order.orderNumber,
        })

        showDialog.value = false
    } catch (e) {
        handleError('Failed to remove order', e)
    }
    removingOrder.value = false
}

const movingOrder = ref(false)

async function moveOrder(dir: number) {
    if (!props.idx) return
    movingOrder.value = true

    try {
        await api.game.warehouse.itemOrders.move.mutate({
            gameID,
            teamID,
            oldIndex: props.idx,
            newIndex: props.idx + dir,
        })
    } catch (e) {
        handleError('Failed to move order', e)
    } finally {
        movingOrder.value = false
    }
}
</script>

<style scoped></style>
