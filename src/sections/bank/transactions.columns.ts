import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'

import { formatter } from '~/utils'
import type { Transaction } from './bank.interface'

export const columns: ColumnDef<Transaction>[] = [
    {
        accessorKey: 'reference',
        header: () => h('div', {}, 'Reference'),
        cell: ({ row }) => {
            return h(
                'div',
                {},
                (row.getValue('reference') as string).toUpperCase().replace(/_/g, ' '),
            )
        },
    },

    {
        accessorKey: 'amount',
        header: () => h('div', { class: 'text-right' }, 'Amount'),
        cell: ({ row }) => {
            const amount = row.getValue('amount') as number
            return h(
                'div',
                {
                    class: `text-right font-medium`,
                },
                formatter(amount),
            )
        },
    },

    {
        accessorKey: 'endBalance',
        header: () => h('div', { class: 'text-right' }, 'End Balance'),
        cell: ({ row }) => {
            const balance = row.getValue('endBalance') as number
            return h(
                'div',
                {
                    class: `text-right font-medium`,
                },
                formatter(balance),
            )
        },
    },

    {
        accessorKey: 'round',
        header: () => h('div', { class: 'text-right' }, 'Round'),
        cell: ({ row }) => {
            return h(
                'div',
                { class: 'text-right font-medium' },
                (row.getValue('round') as number) + 1,
            )
        },
    },

    {
        accessorKey: 'timestamp',
        header: () => h('div', { class: 'text-right' }, 'Time'),
        cell: ({ row }) => {
            return h(
                'div',
                { class: 'text-right font-medium' },
                new Date(row.getValue('timestamp')).toLocaleString(),
            )
        },
    },
]
