<template>
    <DialogHeader>
        <DialogTitle>{{ order.reference }}</DialogTitle>
    </DialogHeader>

    <!-- Inputs -->
    <div>
        <div class="mb-1">Inputs</div>
        <div class="flex flex-wrap gap-2">
            <TooltipProvider
                v-for="item in inputsWithQuantity"
                :key="item.item"
                :disabled="item.possible"
            >
                <Tooltip :delayDuration="100">
                    <TooltipTrigger>
                        <Badge
                            class="text-center w-min h-min flex gap-2 whitespace-nowrap"
                            :class="item.possible ? '' : 'bg-red-500'"
                        >
                            {{ item.quantity }}
                            <span :class="item.possible ? 'text-muted-foreground' : ''">×</span>
                            {{ itemStore.itemDefinitions[item.item].name }}
                        </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                        <div class="text-sm text-muted-foreground max-w-64 space-y-2">
                            You have <span class="font-bold">{{ item.quantityAvailable }}</span>
                            {{ itemStore.itemDefinitions[item.item].name.toLowerCase() }}
                            available, but this order requires
                            <span class="font-bold">{{ item.quantity }}</span
                            >.
                        </div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <Badge
                v-if="order.cash < 0"
                class="text-center w-min h-min flex gap-2 whitespace-nowrap"
                :class="
                    -order.cash * quantityRequested > teamStore.teamStats.cash ? 'bg-red-500' : ''
                "
            >
                {{ formatString(-order.cash * quantityRequested) }}
            </Badge>
        </div>
    </div>

    <div>
        <div class="mb-1">Outputs</div>
        <div class="flex flex-wrap gap-2">
            <TooltipProvider
                v-for="item in order.outputs"
                :key="item.item.key"
                :disabled="hasWarehouseSpace"
            >
                <Tooltip :delayDuration="100">
                    <TooltipTrigger>
                        <Badge
                            class="text-center w-min h-min flex gap-2 whitespace-nowrap"
                            :class="hasWarehouseSpace ? '' : 'bg-red-500'"
                        >
                            {{ item.quantity * quantityRequested }}
                            <span class="text-muted-foreground">×</span>
                            {{ itemStore.itemDefinitions[item.item.key].name }}
                        </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                        <div class="text-sm text-muted-foreground max-w-64 space-y-2">
                            You do not have enough space in your warehouse to store the outputs of
                            this order.
                        </div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <Badge
                v-if="order.cash > 0"
                class="text-center w-min h-min flex gap-2 whitespace-nowrap"
            >
                {{ formatString(order.cash * quantityRequested) }}
            </Badge>
        </div>
    </div>

    <NumberField id="quantity" :default-value="1" :min="0" v-model="quantityRequested">
        <Label for="quantity">Quantity</Label>
        <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput class="text-3xl h-12" />
            <NumberFieldIncrement />
        </NumberFieldContent>
    </NumberField>

    <div class="text-sm text-muted-foreground space-y-2">
        <p>
            The listed inputs and outputs indicate the default manufacturing order you can place.
            Active skills may modify the order. See "Pending Orders" on the home screen for final
            details.
        </p>
    </div>

    <DialogFooter>
        <DialogClose>
            <Button type="button" variant="outline"> Cancel </Button>
        </DialogClose>

        <Button v-if="gameStore.active && possible && quantityRequested > 0" @click="placeOrder">
            Place Order
        </Button>

        <div v-else-if="placingOrder" class="self-end">
            <Button disabled variant="outline">
                <span class="flex items-center gap-2">
                    <span class="scale-50">
                        <LoadingSpinner />
                    </span>
                    <span> Placing Order </span>
                </span>
            </Button>
        </div>

        <TooltipProvider v-else>
            <Tooltip :delayDuration="100">
                <TooltipTrigger class="self-end cursor-default">
                    <Button variant="outline" disabled> Place Order </Button>
                </TooltipTrigger>
                <TooltipContent v-if="quantityRequested == 0"> Quantity is zero </TooltipContent>
                <TooltipContent v-else-if="!possible">
                    Some conditions are not met, review the order carefully
                </TooltipContent>
                <TooltipContent v-else> Game is not active </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    </DialogFooter>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import { Button } from '~/components/ui/button'
import { DialogFooter, DialogHeader, DialogTitle, DialogClose } from '~/components/ui/dialog'
import { Label } from '~/components/ui/label'
import {
    NumberField,
    NumberFieldContent,
    NumberFieldDecrement,
    NumberFieldIncrement,
    NumberFieldInput,
} from '~/components/ui/number-field'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip'
import { Badge } from '~/components/ui/badge'
import type { AvailableItemTransformationOrder } from '@/game/item/item.interface'
import { api } from '~/modules/api/api.utils'
import { useAuthStore } from '~/modules/auth/auth.store'
import { useItemStore } from '~/modules/item/item.store'
import { formatString, handleError } from '~/app.utils'
import { useTeamStore } from '~/modules/team/team.store'
import { useGameStore } from '~/modules/team/modules/game/game.store'
import LoadingSpinner from '~/components/LoadingSpinner.vue'

const authStore = useAuthStore()
const itemStore = (await useItemStore)()
const teamStore = (await useTeamStore)()
const gameStore = (await useGameStore)()

const gameID = authStore.getUser<'team'>().gameID
const teamID = authStore.getUser<'team'>()._id

const props = defineProps<{
    order: AvailableItemTransformationOrder
}>()

const emits = defineEmits<{
    (e: 'close'): void
}>()

const _quantityRequested = ref<number>(1)
const quantityRequested = computed({
    get() {
        return isNaN(_quantityRequested.value) ? 1 : _quantityRequested.value
    },
    set(value) {
        if (value < 0) value = 0
        _quantityRequested.value = value
    },
})

const inputs = props.order.inputs

const inputsWithQuantity = computed(() =>
    inputs.map((input) => {
        const quantity = input.quantity * (quantityRequested.value ?? 0)
        const quantityAvailable = itemStore.itemCounts[input.key]?.available ?? 0
        const possible = quantityAvailable >= quantity

        return {
            item: input.key,
            quantity,
            quantityAvailable,
            possible,
        }
    }),
)

const hasWarehouseSpace = computed(() => {
    const availableWarehouseCapacity = itemStore.warehouseCapacity

    const inputItemCount = inputsWithQuantity.value.reduce((acc, item) => {
        return acc + item.quantity
    }, 0)

    const outputItemCount = props.order.outputs.reduce((acc, item) => {
        return acc + item.quantity * quantityRequested.value
    }, 0)

    return availableWarehouseCapacity + inputItemCount - outputItemCount >= 0
})

const possible = computed(() => {
    return hasWarehouseSpace.value && inputsWithQuantity.value.every((item) => item.possible)
})

const placingOrder = ref(false)

async function placeOrder() {
    placingOrder.value = true
    try {
        await api.game.warehouse.itemOrders.place.mutate({
            gameID,
            teamID,
            key: props.order.key,
            quantity: quantityRequested.value,
        })

        await itemStore.updateWarehouse()

        // Close the dialog
        emits('close')
    } catch (e) {
        handleError('Failed to place order', e)
    }
    placingOrder.value = false
}
</script>

<style scoped></style>
