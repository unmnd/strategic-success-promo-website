<template>
    <Card>
        <CardHeader class="flex flex-row justify-between">
            <CardTitle>Warehouse</CardTitle>
            <UpdateTimer
                :last-update-timestamp="itemStore.lastUpdateTimestamp"
                :update-interval="10000"
                :allow-force-update="true"
                @update="itemStore.updateWarehouse"
            />
        </CardHeader>

        <CardContent>
            <div class="flex flex-col gap-4">
                <WarehouseStats />
                <WarehouseCapacityBar />
                <WarehouseTable />
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import WarehouseStats from './WarehouseStats.vue'
import WarehouseTable from './WarehouseTable.vue'
import WarehouseCapacityBar from './WarehouseCapacityBar.vue'

import { useItemStore } from '~/modules/item/item.store'
import UpdateTimer from '~/components/UpdateTimer.vue'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

const itemStore = (await useItemStore)()
</script>

<style scoped></style>
