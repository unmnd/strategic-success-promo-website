import { z } from 'zod'

import { GameIDTeamIDParams } from '../team/team.interface'
import { ItemQuality } from '../item/item.interface.enum'
import { GameID, Round } from '../game.interface'
import { ItemID, ItemKey, Price } from '../item/item.interface.base'

import { MarketOrderID } from './market.interface.base'

import { TeamID } from '@/auth/auth.interface'
import { ItemDefinition } from '@/game/item/item.interface'

export const MarketTransaction = z.object({
    gameID: GameID,
    itemKey: ItemKey,
    price: z.number(), // Integer in pence
    quantity: z.number(), // Positive integer
    buyer: z.union([TeamID, z.literal('virtual')]),
    seller: z.union([TeamID, z.literal('virtual')]),

    round: z.number(), // Integer
    transactionCount: z.number(), // Integer
})
export type MarketTransaction = z.infer<typeof MarketTransaction>

export const MarketBuyOrder = z.object({
    _id: MarketOrderID,
    gameID: GameID,
    itemKey: ItemKey,
    buyer: z.union([TeamID, z.literal('virtual')]),

    /** Filters */
    minQuality: z.nativeEnum(ItemQuality),
    maxPrice: z.number().int().positive(),

    /** Should always be positive, but might be 0 briefly before it is
     * automatrically removed  */
    quantity: z.number().int().nonnegative(),
})
export type MarketBuyOrder = z.infer<typeof MarketBuyOrder>

export const MarketSellOrder = z.object({
    _id: MarketOrderID,
    gameID: GameID,
    itemKey: ItemKey,
    seller: z.union([TeamID, z.literal('virtual')]),

    /**
     * The item IDs being sold. All items must have identical properties
     * (key, quality, etc)
     */
    items: z.array(ItemID),

    /** The asking price per item */
    price: z.number().int().positive(),

    /** The quality of all items (must be identical) */
    quality: z.nativeEnum(ItemQuality),
})
export type MarketSellOrder = z.infer<typeof MarketSellOrder>

export const MarketOrder = z.union([MarketBuyOrder, MarketSellOrder])
export type MarketOrder = z.infer<typeof MarketOrder>

export const MarketDepth = z.object({
    buy: z.array(z.object({ price: Price, quantity: z.number().int().nonnegative() })),
    sell: z.array(z.object({ price: Price, quantity: z.number().int().nonnegative() })),
})
export type MarketDepth = z.infer<typeof MarketDepth>

const Time = z.number().int().nonnegative()

export const ItemPriceHistory = z.object({
    gameID: GameID,
    itemKey: ItemKey,

    /** The number of in-game ms that have passed since the game started */
    timeRelative: Time,
    price: Price,
    round: Round,
})
export type ItemPriceHistory = z.infer<typeof ItemPriceHistory>

export const Market = z.object({
    _id: GameID,

    /**
     * Checks if the market pre-simulation has been completed.
     */
    preSimulationComplete: z.boolean(),

    /**
     * A count of all fulfilled transactions (excluding pure virtual), used to
     * chronologically order transactions.
     */
    transactionCount: z.number(),

    /**
     * A dynamic object of the market parameters for each item, which
     * adjust how an item price changes with transactions, and
     * parameters to adjust the virtual market.
     */
    marketItemParameters: z.record(
        ItemKey,
        ItemDefinition.shape.initialMarketParameters.omit({ markup: true }),
    ),

    /**
     * The current price of each item, assuming perfect quality, in pence.
     */
    itemPrice: z.record(ItemKey, Price),

    /**
     * A sum cost of all transactions (i.e. price * quantity) for each item
     */
    itemVolume: z.array(
        z.object({
            round: Round,
            itemKey: ItemKey,
            volume: Price,
        }),
    ),
})
export type Market = z.infer<typeof Market>

export const MarketStats = z.object({
    buyOrderCount: z.number(),
    sellOrderCount: z.number(),
    volume: z.number(),
    totalVolume: z.number(),
})
export type MarketStats = z.infer<typeof MarketStats>

export const GameIDTeamIDMarketOrderIDParams = GameIDTeamIDParams.extend({
    orderID: MarketOrderID,
})

export const MarketSellOrderQueryFilter = z.object({
    _id: MarketOrderID.optional(),
    itemKey: ItemKey.optional(),
    seller: z.union([TeamID, z.literal('virtual')]).optional(),
    excludeSeller: z.union([TeamID, z.literal('virtual')]).optional(),
    maxPrice: Price.optional(),
    minQuality: z.nativeEnum(ItemQuality).optional(),
})
export type MarketSellOrderQueryFilter = z.infer<typeof MarketSellOrderQueryFilter>

export const MarketBuyOrderQueryFilter = z.object({
    _id: MarketOrderID.optional(),
    itemKey: ItemKey.optional(),
    buyer: z.union([TeamID, z.literal('virtual')]).optional(),
    excludeBuyer: z.union([TeamID, z.literal('virtual')]).optional(),
    minQuality: z.nativeEnum(ItemQuality).optional(),
    maxPrice: Price.optional(),
})
export type MarketBuyOrderQueryFilter = z.infer<typeof MarketBuyOrderQueryFilter>
