import { defineStore } from 'pinia'
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { formatter, toast } from '~/utils'

export const useMarketStore = defineStore('market', () => {
    const itemPrice = ref(3218)

    const _teamItems = ref(10)

    const teamItems = computed({
        get: () => _teamItems.value,
        set: (value) => {
            _teamItems.value = value
            if (_teamItems.value < 0) {
                _teamItems.value = 0
            }
            if (_teamItems.value > 100) {
                _teamItems.value = 100
            }
        },
    })

    const marketDepth = ref({
        buy: [
            { price: 3133, quantity: 3 },
            { price: 3102, quantity: 3 },
            { price: 3040, quantity: 5 },
            { price: 3188, quantity: 2 },
            { price: 3152, quantity: 8 },
            { price: 2975, quantity: 7 },
            { price: 3095, quantity: 5 },
            { price: 3128, quantity: 9 },
            { price: 2990, quantity: 2 },
            { price: 3201, quantity: 6 },
            { price: 2915, quantity: 6 },
            { price: 3081, quantity: 6 },
            { price: 3001, quantity: 5 },
            { price: 3017, quantity: 4 },
            { price: 3196, quantity: 4 },
            { price: 3202, quantity: 7 },
            { price: 3236, quantity: 5 },
            { price: 3190, quantity: 10 },
        ],
        sell: [
            { price: 4017, quantity: 2 },
            { price: 4018, quantity: 3 },
            { price: 3500, quantity: 25 },
            { price: 4016, quantity: 8 },
            { price: 4221, quantity: 4 },
            { price: 4230, quantity: 6 },
            { price: 4104, quantity: 3 },
            { price: 4166, quantity: 2 },
            { price: 3291, quantity: 7 },
            { price: 4259, quantity: 8 },
            { price: 3641, quantity: 2 },
            { price: 3249, quantity: 4 },
            { price: 3283, quantity: 2 },
            { price: 3932, quantity: 2 },
            { price: 4253, quantity: 5 },
            { price: 3425, quantity: 4 },
            { price: 3428, quantity: 2 },
            { price: 3279, quantity: 6 },
            { price: 3784, quantity: 4 },
            { price: 3918, quantity: 6 },
            { price: 4101, quantity: 7 },
            { price: 4185, quantity: 14 },
            { price: 3290, quantity: 7 },
            { price: 3735, quantity: 3 },
            { price: 4177, quantity: 5 },
            { price: 4274, quantity: 5 },
            { price: 4295, quantity: 8 },
            { price: 4215, quantity: 5 },
            { price: 4385, quantity: 2 },
            { price: 4041, quantity: 2 },
            { price: 4425, quantity: 10 },
            { price: 4121, quantity: 6 },
            { price: 3255, quantity: 4 },
            { price: 3600, quantity: 3 },
            { price: 4398, quantity: 7 },
            { price: 3538, quantity: 4 },
            { price: 3292, quantity: 7 },
        ],
    })

    const bidPrice = computed(() => Math.max(...marketDepth.value.buy.map((order) => order.price)))
    const askPrice = computed(() => Math.min(...marketDepth.value.sell.map((order) => order.price)))

    const marketPriceHistory = ref([
        3168, 3226, 3224, 3222, 3201, 3222, 3171, 3196, 3188, 3190, 3196, 3201, 3222, 3218, 3157,
        3218, 3202, 3218, 3222, 3224, 3046, 3226, 3218, 3202, 3234, 3219, 3249, 3279, 3219, 3279,
        3255, 3249, 3236, 3185, 3201, 3249, 3230, 3243, 3255, 3230, 3231, 3253, 3244, 3237, 3244,
        3253, 3279, 3264, 3266, 3279, 3283, 3287, 3285, 3268, 3285, 3290, 3286, 3067, 3286, 3289,
        3287, 3286, 3287, 3285, 3286, 3285, 3034, 3287, 3289, 3290, 3291, 3258, 3291,
    ])

    const lastPrice = computed(() => marketPriceHistory.value[0])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const teamOrders = ref<any>([
        {
            _id: 'b2d170ff-a5c6-4e47-8aa7-fe5a08f43fea',
            gameID: '680e26456b180ff176920843',
            itemKey: 'pigmentBlue',
            seller: '0d1d23f7-0cae-40c7-ac1f-be8fb3740ded',
            items: [
                '68196b03f51e0ce0ff4570cd',
                '68196b08f51e0ce0ff457127',
                '68196b08f51e0ce0ff457128',
                '68196b08f51e0ce0ff457129',
                '68196b08f51e0ce0ff45712a',
                '68196b08f51e0ce0ff45712b',
                '68196b08f51e0ce0ff45712c',
                '68196b10f51e0ce0ff4572dd',
                '68196b12f51e0ce0ff4573d6',
                '68196b12f51e0ce0ff4573d7',
                '68196b12f51e0ce0ff4573d8',
                '68196b12f51e0ce0ff4573d9',
                '68196b13f51e0ce0ff4573f5',
                '68196b13f51e0ce0ff4573f6',
                '68196b13f51e0ce0ff4573f7',
                '68196b13f51e0ce0ff4573f8',
                '68196b14f51e0ce0ff4573fc',
                '68196b14f51e0ce0ff4573fd',
                '68196b14f51e0ce0ff4573fe',
                '68196b14f51e0ce0ff4573ff',
                '68196b14f51e0ce0ff457400',
                '68196b15f51e0ce0ff4574b5',
                '68196b33f51e0ce0ff457948',
                '68196b33f51e0ce0ff457949',
            ],
            price: 3500,
            quality: 0,
        },
    ])

    const lastUpdateTimestamp = ref(Date.now())

    // Flag to control simulation
    const simulationActive = ref(true)

    function placeBuyOrder(quantity: number, price: number) {
        // If buy price is higher than the current sell market depth min price, fulfill instantly
        if (price >= askPrice.value) {
            // Get the lowest available sell price
            const actualPrice = askPrice.value

            // Find matching sell order
            const sellOrder = marketDepth.value.sell.find((sell) => sell.price === actualPrice)
            if (sellOrder) {
                // Calculate how many items we can actually buy
                const availableQuantity = Math.min(quantity, sellOrder.quantity)
                const remainingQuantity = quantity - availableQuantity

                // Fulfill partial order
                toast.success(
                    `You have purchased ${availableQuantity} Blue Pigment for ${formatter(actualPrice)}`,
                )

                // Set item price to the actual price
                itemPrice.value = actualPrice

                // Add to market history
                marketPriceHistory.value.push(actualPrice)
                marketPriceHistory.value.shift()

                // Update sell order quantity
                sellOrder.quantity -= availableQuantity

                // Remove empty sell orders
                if (sellOrder.quantity === 0) {
                    marketDepth.value.sell = marketDepth.value.sell.filter((sell) => sell.quantity)
                }

                // Update team items
                teamItems.value += availableQuantity

                // If there are remaining items, add them to team orders
                if (remainingQuantity > 0) {
                    teamOrders.value.push({
                        maxPrice: price,
                        quantity: remainingQuantity,
                        buyer: 'team',
                    })
                }

                return
            }
        }

        // If no instant match, add entire order to team orders
        teamOrders.value.push({
            maxPrice: price,
            quantity,
            buyer: 'team',
        })
    }

    function placeSellOrder(quantity: number, price: number) {
        // If sell price is lower than the current buy market depth max price, fulfill instantly
        if (price <= bidPrice.value) {
            let remainingToSell = quantity
            let totalSold = 0

            // Keep matching with buy orders until we sell everything or run out of matches
            while (remainingToSell > 0) {
                // Find next matching buy order - any buy order with price >= sell price
                const buyOrder = marketDepth.value.buy.find((buy) => buy.price >= price)
                if (!buyOrder) break

                // Calculate how many items we can sell to this buy order
                const availableQuantity = Math.min(remainingToSell, buyOrder.quantity)

                // Update buy order quantity
                buyOrder.quantity -= availableQuantity

                // Remove empty buy orders
                if (buyOrder.quantity === 0) {
                    marketDepth.value.buy = marketDepth.value.buy.filter((buy) => buy.quantity)
                }

                // Update remaining quantity and total sold
                remainingToSell -= availableQuantity
                totalSold += availableQuantity
            }

            // If we sold anything, update the market
            if (totalSold > 0) {
                // Fulfill partial order
                toast.success(`You have sold ${totalSold} Blue Pigment for ${formatter(price)}`)

                // Set item price to the sell price
                itemPrice.value = price

                // Add to market history
                marketPriceHistory.value.push(price)
                marketPriceHistory.value.shift()

                // Update team items
                teamItems.value -= totalSold

                // If there are remaining items, add them to team orders
                if (remainingToSell > 0) {
                    teamOrders.value.push({
                        items: Array(remainingToSell)
                            .fill(null)
                            .map(() => crypto.randomUUID()),
                        price,
                        quantity: remainingToSell,
                        seller: 'team',
                    })
                }

                return
            }
        }

        // If no instant match, add entire order to team orders
        teamOrders.value.push({
            items: Array(quantity)
                .fill(null)
                .map(() => crypto.randomUUID()),
            price,
            quantity,
            seller: 'team',
        })
    }

    // Gaussian random function (Box-Muller transform)
    function gaussianRandom(mean = 0, stdev = 1) {
        const u = 1 - Math.random() // Converting [0,1) to (0,1]
        const v = Math.random()
        const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
        return z * stdev + mean
    }

    // Poisson random number generator
    function poissonRandom(lambda: number) {
        if (lambda <= 0) return 0

        const L = Math.exp(-lambda)
        let k = 0
        let p = 1

        do {
            k++
            p *= Math.random()
        } while (p > L)

        return k - 1
    }

    // Function to simulate market activity
    function simulateMarket() {
        if (!simulationActive.value) return

        const now = Date.now()

        // Calculate minutes since last update
        const minutesSinceLastUpdate = (now - lastUpdateTimestamp.value) / 60000

        // Base expected transactions per minute
        const virtualFrequency = 100

        // Calculate expected transactions in this delta
        const expectedTransactions = virtualFrequency * minutesSinceLastUpdate

        // Get actual number of transactions to process
        const actualTransactions = poissonRandom(expectedTransactions)

        // Process each transaction
        for (let i = 0; i < actualTransactions; i++) {
            // 50/50 chance of buy or sell
            const orderType = Math.random() < 0.5 ? 'buy' : 'sell'

            // Current price
            const currentPrice = lastPrice.value

            // Volatility parameters
            const drift = 0.0005 // Small drift component
            const standardDeviation = 0.01 // 1% standard deviation

            let orderPrice
            if (orderType === 'buy') {
                // Buy orders are priced around current price with slight downward bias
                orderPrice = Math.round(
                    gaussianRandom(currentPrice * (1 - drift), currentPrice * standardDeviation),
                )
            } else {
                // Sell orders are priced around current price with slight upward bias
                orderPrice = Math.round(
                    gaussianRandom(
                        currentPrice * (1 + drift * 2),
                        currentPrice * standardDeviation,
                    ),
                )
            }

            // Ensure minimum price of 1
            orderPrice = Math.max(orderPrice, 1)

            // Random quantity between 1-10
            const orderQuantity = Math.floor(Math.random() * 10) + 1

            // Check for matching team orders first
            if (orderType === 'buy') {
                // Find matching team sell orders
                const matchingSellOrders = teamOrders.value.filter(
                    (order: any) => order.seller === 'team' && order.price <= orderPrice,
                )

                if (matchingSellOrders.length > 0) {
                    // Sort by price (lowest first) to ensure best execution
                    matchingSellOrders.sort((a: any, b: any) => a.price - b.price)

                    let remainingToBuy = orderQuantity
                    let totalBought = 0

                    // Try to fulfill as many team sell orders as possible
                    for (const sellOrder of matchingSellOrders) {
                        if (remainingToBuy <= 0) break

                        const availableQuantity = Math.min(remainingToBuy, sellOrder.quantity)

                        // Fulfill the order
                        toast.success(`Team sell order fulfilled at ${formatter(sellOrder.price)}`)

                        // Update price history
                        marketPriceHistory.value.push(sellOrder.price)
                        marketPriceHistory.value.shift()

                        // Update item price
                        itemPrice.value = sellOrder.price

                        // Update team items
                        teamItems.value -= availableQuantity

                        // Update quantities
                        remainingToBuy -= availableQuantity
                        totalBought += availableQuantity
                        sellOrder.quantity -= availableQuantity

                        // Remove fulfilled orders
                        if (sellOrder.quantity === 0) {
                            teamOrders.value = teamOrders.value.filter((o: any) => o !== sellOrder)
                        }
                    }

                    // If we couldn't fulfill the entire buy order, add remainder to market
                    if (remainingToBuy > 0) {
                        marketDepth.value.buy.push({ price: orderPrice, quantity: remainingToBuy })
                        marketDepth.value.buy.sort((a, b) => b.price - a.price)
                    }

                    continue
                }
            } else {
                // Find matching team buy orders
                const matchingBuyOrders = teamOrders.value.filter(
                    (order: any) => order.buyer === 'team' && order.maxPrice >= orderPrice,
                )

                if (matchingBuyOrders.length > 0) {
                    // Sort by max price (highest first) to ensure best execution
                    matchingBuyOrders.sort((a: any, b: any) => b.maxPrice - a.maxPrice)

                    let remainingToSell = orderQuantity
                    let totalSold = 0

                    // Try to fulfill as many team buy orders as possible
                    for (const buyOrder of matchingBuyOrders) {
                        if (remainingToSell <= 0) break

                        const availableQuantity = Math.min(remainingToSell, buyOrder.quantity)

                        // Fulfill the order
                        toast.success(`Team buy order fulfilled at ${formatter(orderPrice)}`)

                        // Update price history
                        marketPriceHistory.value.push(orderPrice)
                        marketPriceHistory.value.shift()

                        // Update item price
                        itemPrice.value = orderPrice

                        // Update team items
                        teamItems.value += availableQuantity

                        // Update quantities
                        remainingToSell -= availableQuantity
                        totalSold += availableQuantity
                        buyOrder.quantity -= availableQuantity

                        // Remove fulfilled orders
                        if (buyOrder.quantity === 0) {
                            teamOrders.value = teamOrders.value.filter((o: any) => o !== buyOrder)
                        }
                    }

                    // If we couldn't fulfill the entire sell order, add remainder to market
                    if (remainingToSell > 0) {
                        marketDepth.value.sell.push({
                            price: orderPrice,
                            quantity: remainingToSell,
                        })
                        marketDepth.value.sell.sort((a, b) => a.price - b.price)
                    }

                    continue
                }
            }

            // If no team orders were fulfilled, add to market depth
            if (orderType === 'buy') {
                marketDepth.value.buy.push({ price: orderPrice, quantity: orderQuantity })
                marketDepth.value.buy.sort((a, b) => b.price - a.price)
            } else {
                marketDepth.value.sell.push({ price: orderPrice, quantity: orderQuantity })
                marketDepth.value.sell.sort((a, b) => a.price - b.price)
            }

            // If this transaction filled a gap between buy and sell, it's executed immediately
            if (bidPrice.value >= askPrice.value) {
                const executionPrice = askPrice.value

                // Update price history with the execution
                marketPriceHistory.value.push(executionPrice)
                marketPriceHistory.value.shift()

                // Update item price
                itemPrice.value = executionPrice

                // Reduce quantities
                const topBuy = marketDepth.value.buy[0]
                const topSell = marketDepth.value.sell[0]

                const transactedQuantity = Math.min(topBuy.quantity, topSell.quantity)

                topBuy.quantity -= transactedQuantity
                topSell.quantity -= transactedQuantity

                // Remove empty orders
                if (topBuy.quantity === 0) {
                    marketDepth.value.buy.shift()
                }

                if (topSell.quantity === 0) {
                    marketDepth.value.sell.shift()
                }
            }
        }

        // Limit market depth to prevent it from growing too large
        if (marketDepth.value.buy.length > 30) {
            marketDepth.value.buy = marketDepth.value.buy.slice(0, 30)
        }

        if (marketDepth.value.sell.length > 40) {
            marketDepth.value.sell = marketDepth.value.sell.slice(0, 40)
        }

        // Limit price history to 100 entries
        marketPriceHistory.value = marketPriceHistory.value.slice(0, 100)

        // Update timestamp
        lastUpdateTimestamp.value = now

        // Schedule next update
        setTimeout(simulateMarket, 2000 + Math.random() * 3000) // Random interval between 2-5 seconds
    }

    // Start simulation when store is created
    onMounted(() => {
        simulateMarket()
    })

    // Clean up on unmount
    onUnmounted(() => {
        simulationActive.value = false
    })

    return {
        itemPrice,
        teamItems,
        marketPriceHistory,
        teamOrders,
        lastUpdateTimestamp,
        marketDepth,
        lastPrice,
        lowestSellPrice: askPrice,
        highestBuyPrice: bidPrice,
        placeBuyOrder,
        placeSellOrder,
    }
})
