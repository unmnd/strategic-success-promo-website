import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import { colouredIcon, icon } from '~/utils'

export const ITEM_DEFINITIONS = {
    waste: {
        name: 'Waste',
        description: 'A waste item',
        unit: 'box',
        icon: icon('ri-delete-bin-line'),
        development: 'raw',
        recipe: {},
        initialMarketParameters: {
            markup: 100,
            virtualFrequency: 10,
            virtualDrift: 0.2,
            virtualVolume: 150,
            virtualStandardDeviation: 0.05,
        },
    },
    solvent: {
        name: 'Solvent',
        description: 'The base chemical used in most paints.',
        unit: 'barrel',
        icon: icon('ri-flask-line'),
        development: 'raw',
        recipe: {},
        initialMarketParameters: {
            markup: 2500,
            virtualFrequency: 100,
            virtualDrift: 0,
            virtualVolume: 15,
            virtualStandardDeviation: 0.05,
        },
    },
    pigmentYellow: {
        name: 'Yellow Pigment',
        description: 'A yellow pigment used in paint, made from cadmium sulfide.',
        unit: 'box',
        icon: colouredIcon('rgb(250 204 21)', 'ri-dropper-line'),
        development: 'raw',
        recipe: {},
        initialMarketParameters: {
            markup: 3800,
            virtualFrequency: 50,
            virtualDrift: 0,
            virtualVolume: 5,
            virtualStandardDeviation: 0.05,
        },
    },
    pigmentBlue: {
        name: 'Blue Pigment',
        description: 'A blue pigment used in paint, made from sodium aluminosilicate.',
        unit: 'box',
        icon: colouredIcon('rgb(6 182 212)', 'ri-dropper-line'),
        development: 'raw',
        recipe: {},
        initialMarketParameters: {
            markup: 3800,
            virtualFrequency: 50,
            virtualDrift: 0,
            virtualVolume: 5,
            virtualStandardDeviation: 0.05,
        },
    },
    paintOrange: {
        name: 'Orange Paint',
        description: 'An orange paint. Can be used for more specialised applications.',
        unit: 'tin',
        icon: colouredIcon('rgb(249 115 22)', 'ri-paint-fill'),
        development: 'intermediate',
        recipe: {
            paintYellow: 0.5,
            paintRed: 0.5,
        },
        initialMarketParameters: {
            markup: 35000,
            virtualFrequency: 40,
            virtualDrift: 0,
            virtualVolume: 1,
            virtualStandardDeviation: 0.1,
        },
    },
}

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
