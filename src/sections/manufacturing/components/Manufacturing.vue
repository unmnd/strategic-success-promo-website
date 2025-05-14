<template>
    <Card>
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

                    <ManufacturingOrdersItem
                        v-for="order in availableItemOrders"
                        :key="order.key"
                        :order="order"
                    />
                </TableBody>
            </Table>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import ManufacturingOrdersItem from './ManufacturingOrdersItem.vue'

import { Table, TableHead, TableHeader, TableRow, TableBody } from '~/components/ui/table'
import { Card, CardContent } from '~/components/ui/card'

import { icon, colouredIcon } from '~/utils'

const availableItemOrders = [
    {
        key: 'createSolvent',
        reference: 'Create Solvent',
        icon: icon('ri-flask-line'),
        placedOrderNumbers: [],
        inputs: [],
        outputs: [
            { item: { key: 'solvent', quality: 1.5 }, quantity: 1 },
            { item: { key: 'waste', quality: 0 }, quantity: 1 },
        ],
        cash: -2000,
    },
    {
        key: 'makePaintYellow',
        reference: 'Make Yellow Paint',
        icon: colouredIcon('rgb(250 204 21)', 'ri-paint-fill'),
        placedOrderNumbers: [],
        inputs: [
            { key: 'pigmentYellow', quantity: 1 },
            { key: 'solvent', quantity: 1 },
        ],
        outputs: [
            { item: { key: 'paintYellow', quality: 1.5 }, quantity: 1 },
            { item: { key: 'waste', quality: 0 }, quantity: 1 },
        ],
        cash: -10000,
    },
    {
        key: 'makePaintRed',
        reference: 'Make Red Paint',
        icon: colouredIcon('rgb(239 68 68)', 'ri-paint-fill'),
        placedOrderNumbers: [],
        inputs: [
            { key: 'pigmentRed', quantity: 1 },
            { key: 'solvent', quantity: 1 },
        ],
        outputs: [
            { item: { key: 'paintRed', quality: 1.5 }, quantity: 1 },
            { item: { key: 'waste', quality: 0 }, quantity: 1 },
        ],
        cash: -10000,
    },
    {
        key: 'mixPaintPurple',
        reference: 'Mix Purple Paint',
        icon: colouredIcon('rgb(99 102 241)', 'ri-paint-fill'),
        placedOrderNumbers: [],
        inputs: [
            { key: 'paintRed', quantity: 1 },
            { key: 'paintBlue', quantity: 1 },
        ],
        outputs: [
            { item: { key: 'paintPurple', quality: 1.5 }, quantity: 2 },
            { item: { key: 'waste', quality: 0 }, quantity: 1 },
        ],
        cash: -10000,
    },
]
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
