import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'

import { useItemStore } from './item.store'

import type { Item, ItemKey } from '@/game/item/item.interface'
import { formatter } from '~/app.utils'

const itemStore = useItemStore()

export async function generateColumns(): Promise<ColumnDef<Item>[]> {
    const itemDefinitions = await itemStore.itemDefinitions

    return [
        {
            accessorKey: 'key',
            header: () => h('div', { class: 'text-right' }, 'Name'),
            cell: ({ row }) => {
                return h(
                    'div',
                    { class: 'text-right font-medium' },
                    itemDefinitions[row.getValue('key') as ItemKey].name,
                )
            },
        },

        {
            accessorKey: 'cost',
            header: () => h('div', { class: 'text-right' }, 'Cost'),
            cell: ({ row }) => {
                return h(
                    'div',
                    { class: 'text-right font-medium' },
                    formatter(row.getValue('cost')),
                )
            },
        },
    ]
}
