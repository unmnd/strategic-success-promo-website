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
                            {{ ITEM_DEFINITIONS[item.item as keyof typeof ITEM_DEFINITIONS].name }}
                        </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                        <div class="text-sm text-muted-foreground max-w-64 space-y-2">
                            You have <span class="font-bold">{{ item.quantityAvailable }}</span>
                            {{
                                ITEM_DEFINITIONS[
                                    item.item as keyof typeof ITEM_DEFINITIONS
                                ].name.toLowerCase()
                            }}
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
                            {{
                                ITEM_DEFINITIONS[item.item.key as keyof typeof ITEM_DEFINITIONS]
                                    .name
                            }}
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

        <Button v-if="quantityRequested > 0" @click="placeOrder"> Place Order </Button>

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

import { formatString, toast } from '~/utils'
import { ITEM_DEFINITIONS } from '../manufacturing.config'

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
        const quantityAvailable = Infinity
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
    const availableWarehouseCapacity = Infinity

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

async function placeOrder() {
    toast.success('Order placed', {
        description:
            'You have placed an order for ' + quantityRequested.value + ' ' + props.order.reference,
    })
    emits('close')
}
</script>

<style scoped></style>
