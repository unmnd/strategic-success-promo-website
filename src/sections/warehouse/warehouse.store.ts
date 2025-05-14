import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import { ITEM_DEFINITIONS } from '../manufacturing/manufacturing.config'

export const useWarehouseStore = defineStore('warehouse', () => {
    const itemCounts = ref<
        Record<string, { quantity: number; available: number; averageCost: number }>
    >({
        paintOrange: { quantity: 12, available: 5, averageCost: 72476.25 },
        solvent: { quantity: 60, available: 46, averageCost: 2526.06 },
        pigmentYellow: { quantity: 50, available: 12, averageCost: 3250.66 },
        pigmentBlue: { quantity: 10, available: 0, averageCost: 3277.9 },
        waste: { quantity: 10, available: 10, averageCost: 1000 },
    })

    const warehouseCapacity = ref(215)
    const totalValue = ref(1521491)
    const hoverItem = ref<string | undefined>(undefined)

    const itemCount = computed(() => {
        return Object.values(itemCounts.value).reduce((acc, item) => acc + item.quantity, 0)
    })

    const sortedItemCounts = computed(() => {
        return Object.entries(itemCounts.value)
            .sort((a, b) => {
                if (b[1].available !== a[1].available) {
                    return b[1].available - a[1].available
                }

                const nameA = ITEM_DEFINITIONS[a[0] as keyof typeof ITEM_DEFINITIONS]?.name ?? a[0]
                const nameB = ITEM_DEFINITIONS[b[0] as keyof typeof ITEM_DEFINITIONS]?.name ?? b[0]

                return nameA.localeCompare(nameB)
            })
            .map(([key, value]) => ({ key, quantity: value.quantity, available: value.available }))
    })

    return {
        itemCounts,
        sortedItemCounts,
        warehouseCapacity,
        totalValue,
        hoverItem,
        itemCount,
    }
})
