<template>
    <div class="flex justify-center flex-col items-center gap-4">
        <Table>
            <TableHeader>
                <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
                    <TableHead v-for="header in headerGroup.headers" :key="header.id">
                        <FlexRender
                            v-if="!header.isPlaceholder"
                            :render="header.column.columnDef.header"
                            :props="header.getContext()"
                        />
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <template v-if="data.length > 0">
                    <TableRow
                        v-for="row in table.getRowModel().rows"
                        :key="row.id"
                        :data-state="row.getIsSelected() ? 'selected' : undefined"
                    >
                        <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                            <FlexRender
                                :render="cell.column.columnDef.cell"
                                :props="cell.getContext()"
                            />
                        </TableCell>
                    </TableRow>
                </template>
                <template v-else>
                    <TableRow>
                        <TableCell :colspan="columns.length" class="h-24 text-center">
                            No results.
                        </TableCell>
                    </TableRow>
                </template>
            </TableBody>
        </Table>

        <div class="flex justify-between w-full">
            <div></div>

            <Pagination
                v-slot="{ page }"
                :total="totalItems"
                :items-per-page="pagination.pageSize"
                :sibling-count="2"
                show-edges
                :default-page="1"
                @update:page="(page) => table.setPageIndex(page - 1)"
            >
                <PaginationContent v-slot="{ items }" class="flex items-center gap-1">
                    <PaginationPrevious />

                    <template v-for="(item, index) in items">
                        <PaginationItem
                            v-if="item.type === 'page'"
                            :key="index"
                            :value="item.value"
                            as-child
                        >
                            <Button
                                class="w-10 h-10 p-0 relative"
                                :variant="item.value === page ? 'default' : 'outline'"
                            >
                                {{ item.value }}
                            </Button>
                        </PaginationItem>
                        <PaginationEllipsis v-else :key="item.type" :index="index" />
                    </template>

                    <PaginationNext />
                </PaginationContent>
            </Pagination>

            <Select
                @update:model-value="updatePageSize($event)"
                :model-value="String(pagination.pageSize)"
            >
                <SelectTrigger class="w-min">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="5"> 5 </SelectItem>
                        <SelectItem value="10"> 10 </SelectItem>
                        <SelectItem value="20"> 20 </SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    </div>
</template>

<script setup lang="ts">
import { FlexRender, getCoreRowModel, useVueTable } from '@tanstack/vue-table'
import { ref, computed } from 'vue'
import { useBankStore } from '../bank.store'
import { columns } from '../transactions.columns'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '~/components/ui/table'
import { Button } from '~/components/ui/button'
import {
    Pagination,
    PaginationEllipsis,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from '~/components/ui/pagination'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '~/components/ui/select'

const bankStore = useBankStore()
const DEFAULT_PAGE_SIZE = 10

const pagination = ref({
    pageIndex: 0,
    pageSize: parseInt(
        localStorage.getItem('bank.transactions.defaultPageSize') || `${DEFAULT_PAGE_SIZE}`,
    ),
})

const totalItems = computed(() => bankStore.transactions.length)
const totalPages = computed(() => Math.ceil(totalItems.value / pagination.value.pageSize))

const data = computed(() => {
    const start = pagination.value.pageIndex * pagination.value.pageSize
    const end = start + pagination.value.pageSize
    return bankStore.transactions.slice(start, end)
})

function updatePageSize(size: string) {
    pagination.value.pageSize = parseInt(size)
    localStorage.setItem('bank.transactions.defaultPageSize', String(size))
}

const table = useVueTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    get pageCount() {
        return totalPages.value
    },
    state: {
        get pagination() {
            return pagination.value
        },
    },
    onPaginationChange: (updater) => {
        if (typeof updater !== 'function') return
        pagination.value = updater(pagination.value)
    },
})
</script>
