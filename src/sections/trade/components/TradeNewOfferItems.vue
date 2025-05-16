<template>
    <div class="flex flex-col gap-2">
        <div class="flex items-end gap-4">
            <div class="flex basis-1/3 flex-col justify-center gap-2">
                <Label for="item">Item</Label>

                <Popover id="item" v-model:open="open">
                    <PopoverTrigger as-child>
                        <Button variant="outline" role="combobox" :aria-expanded="open">
                            <span v-if="key">
                                <span>
                                    <span
                                        v-html="
                                            ITEM_DEFINITIONS[key as keyof typeof ITEM_DEFINITIONS]
                                                .icon
                                        "
                                    ></span>
                                    {{
                                        ITEM_DEFINITIONS[key as keyof typeof ITEM_DEFINITIONS].name
                                    }}
                                </span>

                                <span class="text-muted-foreground ml-auto" v-if="maxQuantity">
                                    ({{ maxQuantity }} available)
                                </span>
                            </span>

                            <span v-else> Select item... </span>

                            <i class="ri-arrow-down-s-line ml-auto h-4 w-4"></i>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent class="p-0">
                        <Command>
                            <CommandInput class="h-9" placeholder="Search..." />
                            <CommandEmpty>No items found.</CommandEmpty>
                            <CommandList>
                                <CommandGroup>
                                    <CommandItem
                                        v-for="item in items"
                                        :key="item.itemKey"
                                        :value="item.itemKey"
                                        @select="
                                            (ev) => {
                                                if (typeof ev.detail.value === 'string') {
                                                    key = ev.detail.value
                                                }
                                                open = false
                                            }
                                        "
                                        class="flex items-center gap-2"
                                    >
                                        <span class="grow">
                                            <span
                                                v-html="
                                                    ITEM_DEFINITIONS[
                                                        item.itemKey as keyof typeof ITEM_DEFINITIONS
                                                    ].icon
                                                "
                                            ></span>
                                            {{
                                                ITEM_DEFINITIONS[
                                                    item.itemKey as keyof typeof ITEM_DEFINITIONS
                                                ].name
                                            }}
                                        </span>

                                        <span class="text-muted-foreground" v-if="item.quantity">
                                            ({{ item.quantity }} available)
                                        </span>

                                        <i
                                            class="ri-check-line h-4 w-4"
                                            :class="
                                                key === item.itemKey ? 'opacity-100' : 'opacity-0'
                                            "
                                        ></i>
                                    </CommandItem>
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            <div class="flex basis-1/3 flex-col justify-center gap-2">
                <NumberField
                    id="price"
                    :default-value="0"
                    :min="0.0"
                    :step="0.01"
                    :disabled="!key"
                    :format-options="{
                        style: 'currency',
                        currency: 'GBP',
                        currencyDisplay: 'symbol',
                        currencySign: 'standard',
                    }"
                    v-model="price"
                >
                    <Label for="price">Price Each</Label>
                    <div class="flex gap-2">
                        <NumberFieldContent class="grow">
                            <NumberFieldDecrement />
                            <NumberFieldInput />
                            <NumberFieldIncrement />
                        </NumberFieldContent>

                        <Button
                            variant="outline"
                            type="button"
                            class="w-10"
                            :disabled="!key || !quantity"
                            @click="price = 0"
                        >
                            <i class="ri-number-0"></i>
                        </Button>

                        <Button
                            variant="outline"
                            type="button"
                            class="w-10"
                            :disabled="!key || !quantity"
                            @click="price = tradeStore.itemPrice[key] / 100"
                        >
                            <i class="ri-store-2-line"></i>
                        </Button>
                    </div>
                </NumberField>
            </div>

            <NumberField
                id="quantity"
                class="basis-1/3"
                :default-value="1"
                :min="0"
                :max="maxQuantity ?? Infinity"
                :disabled="!key"
                v-model="quantity"
            >
                <Label for="quantity">Quantity</Label>
                <NumberFieldContent>
                    <NumberFieldDecrement />
                    <NumberFieldInput />
                    <NumberFieldIncrement />
                </NumberFieldContent>
            </NumberField>

            <Button class="w-10" type="button" @click="addItem" :disabled="!key || !quantity">
                <i class="ri-add-line"></i>
            </Button>
        </div>
        <Table class="table-fixed">
            <TableHeader>
                <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Trade Price</TableHead>
                    <TableHead>Market Price</TableHead>
                    <!--<TableHead>Difference</TableHead> -->
                    <TableHead class="text-center">Quantity</TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow v-if="selectedItems.length === 0" colspan="4">
                    <TableCell colspan="5" class="text-center"> No items offered. </TableCell>
                </TableRow>

                <TableRow v-for="(item, index) in selectedItems" :key="index">
                    <TableCell>
                        <span
                            v-html="
                                ITEM_DEFINITIONS[item.itemKey as keyof typeof ITEM_DEFINITIONS].icon
                            "
                        ></span>
                        {{ ITEM_DEFINITIONS[item.itemKey as keyof typeof ITEM_DEFINITIONS].name }}
                    </TableCell>
                    <TableCell>{{ formatter(item.price) }}</TableCell>
                    <TableCell>{{ formatter(tradeStore.itemPrice[item.itemKey]) }}</TableCell>
                    <!-- <TableCell>{{ formatter(marketStore.itemPrice[item.itemKey]) }}</TableCell>
                    <TableCell>
                        {{
                            Math.round(
                                ((item.price - marketStore.itemPrice[item.itemKey]) /
                                    marketStore.itemPrice[item.itemKey]) *
                                    100,
                            )
                        }}%
                    </TableCell> -->
                    <TableCell class="text-center">{{ item.quantity }}</TableCell>
                    <TableCell class="text-end">
                        <Button type="button" variant="outline" @click="removeItem(index)"
                            >Remove</Button
                        >
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '~/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import {
    NumberField,
    NumberFieldContent,
    NumberFieldDecrement,
    NumberFieldIncrement,
    NumberFieldInput,
} from '~/components/ui/number-field'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '~/components/ui/table'
import { formatter } from '~/utils'
import { ITEM_DEFINITIONS } from '~/sections/manufacturing/manufacturing.config'
import { useTradeStore } from '../trade.store'

const props = defineProps<{
    type: 'offer' | 'request'
}>()

const tradeStore = useTradeStore()

const items = computed<
    {
        itemKey: string
        quantity?: number
    }[]
>(() => {
    if (props.type === 'offer') {
        return tradeStore.teamItems
    } else {
        return Object.keys(ITEM_DEFINITIONS).map((item) => {
            return {
                itemKey: item,
            }
        })
    }
})

const open = ref(false)
const key = ref('')

const price = ref(0)
const quantity = ref(1)
const maxQuantity = computed(() => {
    return items.value.find((item) => item.itemKey === key.value)?.quantity
})

const selectedItems = computed({
    get() {
        return props.type === 'offer'
            ? tradeStore.pendingTradeOffer.itemsOffer
            : tradeStore.pendingTradeOffer.itemsRequest
    },
    set(value) {
        if (props.type === 'offer') {
            tradeStore.pendingTradeOffer.itemsOffer = value
        } else {
            tradeStore.pendingTradeOffer.itemsRequest = value
        }
    },
})

watch(key, () => {
    price.value = (tradeStore.itemPrice[key.value] ?? 0) / 100
    quantity.value = 1
})

const addItem = () => {
    // Check for all required fields (price can be 0)
    if (!key.value || !quantity.value) {
        return
    }

    selectedItems.value.push({
        itemKey: key.value,
        price: Math.round(price.value * 100),
        quantity: quantity.value,
    })

    key.value = ''
    price.value = 0
    quantity.value = 1
}

const removeItem = (index: number) => {
    selectedItems.value.splice(index, 1)
}
</script>

<style scoped></style>
