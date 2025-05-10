<template>
    <div class="flex flex-col gap-4">
        <NumberField
            id="quantity"
            :default-value="1"
            :min="0"
            :max="availableToSell"
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
            <Label for="price">Price</Label>
            <TooltipProvider>
                <Tooltip :delayDuration="100" :open="priceRatio > 1.1">
                    <TooltipTrigger>
                        <NumberFieldContent>
                            <NumberFieldDecrement />
                            <NumberFieldInput class="text-3xl h-12" />
                            <NumberFieldIncrement />
                        </NumberFieldContent>
                    </TooltipTrigger>
                    <TooltipContent>
                        <div class="text-sm text-red-500">
                            <p>
                                Max price set is
                                {{ ((priceRatio - 1) * 100).toFixed(0) }}% above market price.
                            </p>
                            <p>It will be less likely to be filled.</p>
                        </div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </NumberField>

        <div class="flex justify-between w-full gap-2">
            <div>
                <Label for="price">Average Cost</Label>
                <div class="text-3xl font-extrabold tracking-tight lg:text-5xl">
                    {{ formatter(3104) }}
                </div>
            </div>

            <div>
                <Label for="price">Items Remaining</Label>
                <div class="text-3xl font-extrabold tracking-tight lg:text-5xl">
                    {{ availableToSell - quantity }}
                </div>
            </div>

            <div class="text-end">
                <Label for="price"> Total</Label>
                <div class="text-3xl font-extrabold tracking-tight lg:text-5xl">
                    {{ formatter(price * 100 * quantity) }}
                </div>
            </div>
        </div>

        <AlertDialog v-if="!placingOrder && quantity > 0">
            <AlertDialogTrigger class="self-end">
                <Button> Place Sell Order </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Buy Order Confirmation</AlertDialogTitle>

                    <div>
                        Are you sure you want to place a sell order for
                        <span class="font-bold">{{ quantity }} {{ itemDefinition.name }}</span> at a
                        price of <span class="font-bold">{{ formatter(price * 100) }}</span> each?
                    </div>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>

                    <TooltipProvider>
                        <Tooltip :delayDuration="0">
                            <TooltipTrigger>
                                <AlertDialogAction @click="placeSellOrder(quantity, price * 100)">
                                    Place Order
                                </AlertDialogAction>
                            </TooltipTrigger>
                            <TooltipContent>
                                <div class="text-sm text-muted-foreground max-w-64 space-y-2">
                                    <p>
                                        Placing a sell order does not guarantee a purchase. You are
                                        committing to sell if a matching transaction is found.
                                    </p>
                                    <p>
                                        Orders may be partially fulfilled and will continue to be
                                        filled by available buyers until completed.
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
                    <Button disabled> Place Sell Order </Button>
                </TooltipTrigger>
                <TooltipContent> Quantity is zero </TooltipContent>
            </Tooltip>
        </TooltipProvider>

        <TooltipProvider v-else>
            <Tooltip :delayDuration="100">
                <TooltipTrigger class="self-end cursor-default">
                    <Button disabled> Place Sell Order </Button>
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

const { teamItems } = storeToRefs(useMarketStore())

const availableToSell = computed(() => teamItems.value)

watch(
    availableToSell,
    (newValue) => {
        quantity.value = Math.min(newValue, quantity.value)
    },
    { immediate: true },
)

const priceRatio = computed(() => price.value / (props.itemPrice / 100))

const placingOrder = ref(false)

const { placeSellOrder } = useMarketStore()

// async function placeSellOrder() {
//   teamOrders.value.push({
//     _id: crypto.randomUUID(),
//     gameID: 'game',
//     itemKey: props.itemKey,
//     seller: 'user',
//     items: Array(quantity.value)
//       .fill(null)
//       .map(() => crypto.randomUUID()),
//     price: Math.round(price.value * 100), // Convert to pence
//     quality: props.itemDefinition.quality,
//   })
// }
</script>

<style scoped></style>
