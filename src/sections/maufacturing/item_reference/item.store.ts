import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { api, on } from '../api/api.utils'
import { useAuthStore } from '../auth/auth.store'

import type {
    AvailableItemTransformationOrder,
    ItemCount,
    ItemTransformationOrder,
} from '@/game/item/item.interface'
import { noConcurrent } from '~/app.utils'
import { ItemKey } from '@/game/item/item.interface.base'

const authStore = useAuthStore()

const gameID = authStore.getUser<'team'>().gameID
const teamID = authStore.getUser<'team'>()._id

export const useItemStore = (async () => {
    const itemDefinitions = await api.game.item.definitions.query(gameID)

    const itemCounts = ref<ItemCount>(await api.game.item.fullCount.query(teamID))
    const sortedItemCounts = computed(() => {
        return Object.entries(itemCounts.value)
            .sort((a, b) => {
                if (b[1].available !== a[1].available) {
                    return b[1].available - a[1].available
                }

                const nameA = itemDefinitions[a[0]].name ?? a[0]
                const nameB = itemDefinitions[b[0]].name ?? b[0]

                return nameA.localeCompare(nameB)
            })
            .map(([key, value]) => ({ key, quantity: value.quantity, available: value.available }))
    })

    const itemCount = computed(() => {
        return Object.values(itemCounts.value).reduce((acc, item) => acc + item.quantity, 0)
    })

    const warehouseCapacity = ref<number>(await api.game.warehouse.totalCapacity.query(teamID))
    const totalValue = ref(await api.game.warehouse.totalValue.query(teamID))
    const availableItemOrders = ref<AvailableItemTransformationOrder[]>(
        await api.game.warehouse.itemOrders.available.query(teamID),
    )
    const itemOrders = ref<ItemTransformationOrder[]>(
        await api.game.warehouse.itemOrders.list.query(teamID),
    )

    const lastUpdateTimestamp = ref(Date.now())
    const updateWarehouse = noConcurrent(async () => {
        itemCounts.value = await api.game.item.fullCount.query(teamID)
        warehouseCapacity.value = await api.game.warehouse.totalCapacity.query(teamID)
        totalValue.value = await api.game.warehouse.totalValue.query(teamID)
        availableItemOrders.value = await api.game.warehouse.itemOrders.available.query(teamID)
        itemOrders.value = await api.game.warehouse.itemOrders.list.query(teamID)

        lastUpdateTimestamp.value = Date.now()
    })
    on('game.item.update', updateWarehouse)
    on('game.warehouse.update', updateWarehouse)

    const hoverItem = ref<ItemKey | undefined>(undefined)

    return defineStore('item', () => {
        return {
            itemDefinitions,

            itemCounts,
            sortedItemCounts,
            itemCount,
            warehouseCapacity,
            totalValue,
            availableItemOrders,
            itemOrders,

            hoverItem,

            lastUpdateTimestamp,
            updateWarehouse,
        }
    })
})()
