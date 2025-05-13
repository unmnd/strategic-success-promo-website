<template>
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Name</TableHead>
                <TableHead class="text-right">Average Cost</TableHead>
                <TableHead class="text-right">
                    <div class="flex justify-end items-center gap-1">
                        <span> Available </span>

                        <TooltipProvider>
                            <Tooltip :delayDuration="100">
                                <TooltipTrigger>
                                    <i class="ri-question-line"></i>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <div class="text-sm text-muted-foreground max-w-64">
                                        Available items are items which are not listed for sale on
                                        the market, and are not scheduled to be used in a
                                        manufacturing order.
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </TableHead>
                <TableHead class="text-right">Total</TableHead>
            </TableRow>
        </TableHeader>

        <TableBody>
            <TableRow
                v-for="{ key, quantity, available } in nonzeroItemCounts"
                :key="key"
                @mouseenter="itemStore.hoverItem = key"
                @mouseleave="itemStore.hoverItem = undefined"
                :class="itemStore.hoverItem === key ? 'bg-muted/50' : ''"
            >
                <TableCell class="font-medium">
                    <span v-html="itemDefinitions[key].icon"></span>
                    {{ itemDefinitions[key].name }}
                </TableCell>

                <TableCell class="text-right">
                    {{ formatter(itemStore.itemCounts[key].averageCost) }}
                </TableCell>

                <TableCell class="text-2xl text-right font-extrabold">
                    {{ available }}
                </TableCell>

                <TableCell class="text-2xl text-right font-extrabold">
                    {{ quantity }}
                </TableCell>
            </TableRow>
        </TableBody>
    </Table>

    <div
        v-if="nonzeroItemCounts.length === 0"
        class="flex items-center text-muted-foreground justify-center w-full h-full gap-1"
    >
        <i class="ri-error-warning-line"></i>
        No items available
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import {
    Table,
    TableBody,
    TableCell,
    TableRow,
    TableHeader,
    TableHead,
} from '~/components/ui/table'
import { useItemStore } from '~/modules/item/item.store'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip'
import { formatter } from '~/app.utils'

const itemStore = (await useItemStore)()

const itemDefinitions = itemStore.itemDefinitions

const nonzeroItemCounts = computed(() => {
    return itemStore.sortedItemCounts.filter((item) => item.quantity > 0)
})
</script>

<style scoped></style>
