<template>
    <Card>
        <CardHeader>
            <CardTitle>Manufacturing</CardTitle>
        </CardHeader>

        <CardContent>
            <Table class="mb-4">
                <TableHeader>
                    <TableRow>
                        <TableHead>Reference</TableHead>
                        <TableHead>Inputs</TableHead>
                        <TableHead>Outputs</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    <!-- <TableRow class="pointer-events-none h-16">
                        <TableCell class="text-muted-foreground text-xs align-bottom">
                            Available Orders
                        </TableCell>
                    </TableRow> -->

                    <TableRow
                        class="pointer-events-none"
                        v-if="itemStore.availableItemOrders.length === 0"
                    >
                        <TableCell class="flex justify-center gap-1">
                            <i class="ri-error-warning-line"></i>
                            No Orders Available to Place
                        </TableCell>
                    </TableRow>

                    <ManufacturingOrdersItem
                        v-for="order in itemStore.availableItemOrders"
                        :key="order.key"
                        :order="order"
                    />
                </TableBody>
            </Table>

            <!--
                    <TableRow class="hover:bg-unset">
                        <TableCell class="px-0 pb-0 pt-6" colspan="4"> -->
            <Card>
                <CardHeader>
                    <CardTitle>Pending Orders</CardTitle>
                </CardHeader>
                <CardContent class="p-0">
                    <ManufacturingStats class="mb-4" />

                    <Table>
                        <TableBody class="overflow-x-clip">
                            <TransitionGroup name="list">
                                <ManufacturingOrdersItem
                                    v-for="(order, idx) in itemStore.itemOrders"
                                    :key="order.orderNumber"
                                    :order="order"
                                    :idx="idx"
                                />
                            </TransitionGroup>

                            <TableRow
                                class="pointer-events-none"
                                v-if="itemStore.itemOrders.length === 0"
                            >
                                <TableCell class="flex justify-center gap-1">
                                    <i class="ri-error-warning-line"></i>
                                    No Pending Orders
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <!-- </TableCell>
                    </TableRow> -->
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import ManufacturingOrdersItem from './ManufacturingOrdersItem.vue'
import ManufacturingStats from './ManufacturingStats.vue'

import {
    Table,
    TableHead,
    TableHeader,
    TableRow,
    TableBody,
    TableCell,
} from '~/components/ui/table'
import { useItemStore } from '~/modules/item/item.store'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

const itemStore = (await useItemStore)()
</script>

<style scoped>
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
    position: absolute;
}
</style>
