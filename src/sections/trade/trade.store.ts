import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ITEM_DEFINITIONS } from '../manufacturing/manufacturing.config'

type TradeOffer = {
    itemsOffer: {
        itemKey: string
        quantity: number
        price: number
    }[]
    cashOffer: number
    itemsRequest: {
        itemKey: string
        quantity: number
        price: number
    }[]
    cashRequest: number
}

export const useTradeStore = defineStore('trade', () => {
    // Randomly select between 3 and 6 unique items from ITEM_DEFINITIONS
    const itemKeys = Object.keys(ITEM_DEFINITIONS)
    const shuffled = itemKeys
        .map((key) => ({ key, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ key }) => key)
    const count = Math.floor(Math.random() * 4) + 3 // 3 to 6 items
    const teamItems = ref(
        shuffled.slice(0, count).map((itemKey) => ({
            itemKey,
            quantity: Math.floor(Math.random() * 51), // 0 to 50
        })),
    )

    const itemPrice = ref(
        Object.entries({
            waste: 100,
            solvent: 1000,
            pigmentYellow: 4000,
            pigmentRed: 4000,
            pigmentBlue: 4000,
            paintYellow: 12000,
            paintRed: 12000,
            paintBlue: 12000,
            paintPurple: 30000,
            paintGreen: 30000,
            paintOrange: 30000,
        }).reduce(
            (acc, [item, basePrice]) => {
                // Assign a random price within ±10% of the base value
                const min = Math.floor(basePrice * 0.9)
                const max = Math.ceil(basePrice * 1.1)
                acc[item] = Math.floor(Math.random() * (max - min + 1)) + min
                return acc
            },
            {} as Record<string, number>,
        ),
    )

    function createDefaultTradeOffer(): TradeOffer {
        // Create random offer items (0-3) from team items
        const numOfferItems = Math.floor(Math.random() * 4) // 0-3 items
        const availableTeamItems = [...teamItems.value]
        const itemsOffer = []
        const offeredItemKeys = new Set<string>() // Track offered item keys

        for (let i = 0; i < numOfferItems && availableTeamItems.length > 0; i++) {
            // Pick a random team item
            const randomIndex = Math.floor(Math.random() * availableTeamItems.length)
            const teamItem = availableTeamItems.splice(randomIndex, 1)[0]

            // Offer a random quantity (1 to available quantity)
            const maxQuantity = teamItem.quantity
            const quantity = maxQuantity > 0 ? Math.floor(Math.random() * maxQuantity) + 1 : 0

            if (quantity > 0) {
                // Calculate a realistic price - sometimes discounted or zero
                const itemMarketPrice = itemPrice.value[teamItem.itemKey]
                const offerPrice = calculateRealisticTradePrice(itemMarketPrice)

                itemsOffer.push({
                    itemKey: teamItem.itemKey,
                    quantity,
                    price: offerPrice,
                })

                // Add to the set of offered items to avoid requesting the same item
                offeredItemKeys.add(teamItem.itemKey)
            }
        }

        // Create random request items (0-3) from all available items
        const numRequestItems = Math.floor(Math.random() * 4) // 0-3 items
        const availableItems = Object.keys(itemPrice.value).filter(
            (item) => !offeredItemKeys.has(item),
        ) // Filter out offered items
        const itemsRequest = []

        for (let i = 0; i < numRequestItems && availableItems.length > 0; i++) {
            // Pick a random item
            const randomIndex = Math.floor(Math.random() * availableItems.length)
            const itemKey = availableItems.splice(randomIndex, 1)[0]

            // Request a random quantity (1-10)
            const quantity = Math.floor(Math.random() * 10) + 1

            // Calculate a realistic price - sometimes discounted or zero
            const itemMarketPrice = itemPrice.value[itemKey]
            const requestPrice = calculateRealisticTradePrice(itemMarketPrice)

            itemsRequest.push({
                itemKey,
                quantity,
                price: requestPrice,
            })
        }

        // Create initial trade offer
        const tradeOffer: TradeOffer = {
            itemsOffer,
            cashOffer: 0,
            itemsRequest,
            cashRequest: 0,
        }

        // Calculate trade stats to balance with cash
        const stats = calculateTradeStats(tradeOffer)

        // Calculate cash needed to balance trade to have favorability between 0 and 0.1
        const targetFavorability = Math.random() * 0.1 // Random value between 0 and 0.1
        const currentValue = stats.netTradeValue - stats.netMarketValue
        const targetValue = targetFavorability * stats.tradeVolume
        const cashAdjustment = targetValue - currentValue

        if (cashAdjustment > 0) {
            tradeOffer.cashOffer = Math.round(cashAdjustment)
        } else if (cashAdjustment < 0) {
            tradeOffer.cashRequest = Math.round(-cashAdjustment)
        }

        return tradeOffer
    }

    const defaultTradeOffer = createDefaultTradeOffer()

    const pendingTradeOffer = ref(structuredClone(defaultTradeOffer))
    const pendingTradeOfferReceiver = ref<string | null>(null)
    const pendingTradeOfferExpiresOn = ref<number | null>(null)

    function calculateTradeStats(offer: TradeOffer) {
        const totalOfferedValue = offer.itemsOffer.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0,
        )
        const totalRequestedValue = offer.itemsRequest.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0,
        )
        const netTradeValue = totalRequestedValue - totalOfferedValue

        const marketValueOffered = offer.itemsOffer.reduce(
            (acc, item) => acc + itemPrice.value[item.itemKey] * item.quantity,
            0,
        )
        const marketValueRequested = offer.itemsRequest.reduce(
            (acc, item) => acc + itemPrice.value[item.itemKey] * item.quantity,
            0,
        )
        const netMarketValue = marketValueRequested - marketValueOffered

        const tradeValue = netTradeValue - netMarketValue + offer.cashOffer - offer.cashRequest

        const tradeVolume = netTradeValue + netMarketValue + offer.cashOffer + offer.cashRequest

        const tradeFavourability =
            tradeVolume === 0 ? 0 : Math.abs(tradeValue / tradeVolume) * (tradeValue > 0 ? 1 : -1)

        return {
            totalOfferedValue,
            totalRequestedValue,
            netTradeValue,
            marketValueOffered,
            marketValueRequested,
            netMarketValue,
            tradeValue,
            tradeVolume,
            tradeFavourability,
        }
    }

    // Helper function to create realistic trade prices
    function calculateRealisticTradePrice(marketPrice: number): number {
        const random = Math.random()

        // 10% chance of being free
        if (random < 0.1) {
            return 0
        }

        // 40% chance of discount
        if (random < 0.5) {
            // Apply discount between 10-30%
            const discountFactor = 0.7 + Math.random() * 0.2 // 0.7-0.9 = 10-30% discount
            const discountedPrice = marketPrice * discountFactor
            // Round to nearest £10
            return Math.round(discountedPrice / 1000) * 1000
        }

        // 40% chance of markup
        if (random < 0.9) {
            // Apply markup between 10-30%
            const markupFactor = 1.1 + Math.random() * 0.2 // 1.1-1.3 = 10-30% markup
            const markedUpPrice = marketPrice * markupFactor
            // Round to nearest £10
            return Math.round(markedUpPrice / 1000) * 1000
        }

        // 10% chance of exact market price rounded to nearest £10
        return Math.round(marketPrice / 1000) * 1000
    }

    return {
        pendingTradeOffer,
        pendingTradeOfferReceiver,
        pendingTradeOfferExpiresOn,

        itemPrice,
        teamItems,

        calculateTradeStats,
    }
})
