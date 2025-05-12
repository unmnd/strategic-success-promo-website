<template>
    <Card class="w-full">
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

import { Card, CardContent } from '~/components/ui/card'
</script>

<style scoped></style>
