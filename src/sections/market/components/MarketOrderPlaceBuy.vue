<template>
    <div class="flex flex-col gap-4">
        <NumberField
            id="quantity"
            :default-value="1"
            :min="0"
            :max="warehouseRemainingCapacity"
            v-model="quantity"
        >
            <Label for="quantity">Quantity</Label>
            <NumberFieldContent>
                <NumberFieldDecrement />
                <NumberFieldInput class="text-3xl h-12" />
                <NumberFieldIncrement />
            </NumberFieldContent>
        </NumberField>

        <NumberField
            id="price"
            :default-value="itemPrice / 100"
            :min="0.01"
            :step="0.01"
            :format-options="{
                style: 'currency',
                currency: 'GBP',
                currencyDisplay: 'symbol',
                currencySign: 'standard',
            }"
            v-model="price"
        >
            <Label for="price">Maximum Price</Label>
            <TooltipProvider>
                <Tooltip :delayDuration="100" :open="priceRatio < 0.9">
                    <TooltipTrigger>
                        <NumberFieldContent>
                            <NumberFieldDecrement />
                            <NumberFieldInput class="text-3xl h-12" />
                            <NumberFieldIncrement />
                        </NumberFieldContent>
                    </TooltipTrigger>
                    <TooltipContent class="!z-[1]">
                        <div class="text-sm text-red-500">
                            <p>
                                Max price set is
                                {{ Math.abs((priceRatio - 1) * 100).toFixed(0) }}% below market
                                price.
                            </p>
                            <p>It will be less likely to be filled.</p>
                        </div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </NumberField>

        <div class="flex justify-between w-full gap-2">
            <div>
                <Label for="price">Remaining Warehouse Capacity</Label>
                <div class="text-3xl font-extrabold tracking-tight lg:text-5xl">
                    {{ warehouseRemainingCapacity - quantity }}
                </div>
            </div>
            <div>
                <Label for="price">Maximum Total</Label>
                <div class="text-3xl font-extrabold tracking-tight lg:text-5xl">
                    {{ formatter(price * 100 * quantity) }}
                </div>
            </div>
        </div>

        <AlertDialog v-if="!placingOrder && quantity > 0">
            <AlertDialogTrigger class="self-end">
                <Button> Place Buy Order </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Buy Order Confirmation</AlertDialogTitle>

                    <div>
                        Are you sure you want to place a buy order for
                        <span class="font-bold">{{ quantity }} {{ itemDefinition.name }}</span> at a
                        maximum price of
                        <span class="font-bold">{{ formatter(price * 100) }}</span> each?
                    </div>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>

                    <TooltipProvider>
                        <Tooltip :delayDuration="0">
                            <TooltipTrigger>
                                <AlertDialogAction @click="placeBuyOrder(quantity, price * 100)"
                                    >Place Order</AlertDialogAction
                                >
                            </TooltipTrigger>
                            <TooltipContent>
                                <div class="text-sm text-muted-foreground max-w-64 space-y-2">
                                    <p>
                                        Placing a buy order does not guarantee a purchase. You are
                                        committing to buy if a matching transaction is found.
                                    </p>
                                    <p>
                                        Orders may be partially fulfilled and will continue to be
                                        filled by available sale items until completed.
                                    </p>
                                    <p>
                                        The final price may fluctuate with market conditions, but it
                                        will never exceed the maximum price you have set.
                                    </p>
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <TooltipProvider v-else-if="quantity == 0">
            <Tooltip :delayDuration="100">
                <TooltipTrigger class="self-end cursor-default">
                    <Button disabled> Place Buy Order </Button>
                </TooltipTrigger>
                <TooltipContent> Quantity is zero </TooltipContent>
            </Tooltip>
        </TooltipProvider>

        <TooltipProvider v-else>
            <Tooltip :delayDuration="100">
                <TooltipTrigger class="self-end cursor-default">
                    <Button disabled> Place Buy Order </Button>
                </TooltipTrigger>
                <TooltipContent> Game is not active </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import {
    NumberField,
    NumberFieldContent,
    NumberFieldDecrement,
    NumberFieldIncrement,
    NumberFieldInput,
} from '~/components/ui/number-field'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '~/components/ui/alert-dialog'
import { formatter } from '~/utils'
import { useMarketStore } from '../market.store'
import { storeToRefs } from 'pinia'

const { placeBuyOrder } = useMarketStore()

const props = defineProps<{
    itemKey: string
    itemPrice: number
    itemDefinition: any // eslint-disable-line @typescript-eslint/no-explicit-any
    updateCounter: number // Used to force re-render
}>()

defineEmits<{
    (e: 'update'): void
}>()

const quantity = ref(1)
const price = ref(props.itemPrice / 100)

const priceRatio = computed(() => price.value / (props.itemPrice / 100))

const { teamItems } = storeToRefs(useMarketStore())

const warehouseRemainingCapacity = computed(() => 100 - teamItems.value)

watch(
    () => warehouseRemainingCapacity.value,
    (newValue) => {
        quantity.value = Math.min(newValue, quantity.value)
    },
    { immediate: true },
)

const placingOrder = ref(false)

// async function placeBuyOrder() {
//   teamOrders.value.push({
//     itemKey: props.itemKey,
//     price: Math.round(price.value * 100), // Convert to pence
//     quantity: quantity.value,
//     minQuality: props.itemDefinition.quality,
//     maxPrice: Math.round(price.value * 100), // Convert to pence
//     buyer: 'virtual', // TODO: Replace with actual team ID
//     gameID: 'current-game', // TODO: Replace with actual game ID
//     _id: crypto.randomUUID(), // Generate unique ID
//   })
// }
</script>

<style scoped></style>
