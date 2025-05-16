import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { api, on } from '../api/api.utils'
import { useAuthStore } from '../auth/auth.store'
import { useGameStore } from '../team/modules/game/game.store'
import { useMarketStore } from '../market/market.store'

import type { TradeOffer } from '@/game/trade/trade.interface'
import type { TradeOfferID } from '@/game/trade/trade.interface.base'
import type { TeamID } from '@/auth/auth.interface'
import type { TeamName } from '@/game/team/team.interface'
import { toast } from '~/utils'
import { TradeOfferStatus } from '@/game/trade/trade.interface.enum'

const authStore = useAuthStore()
const teamID = authStore.getUser()._id

export const useTradeStore = (async () => {
    const marketStore = (await useMarketStore)()
    const gameStore = (await useGameStore)()

    const teamNames: Record<TeamID, TeamName> = await api.game.teams.names.query(gameStore.gameID)

    const tradeOffers = ref<Map<TradeOfferID, TradeOffer>>(new Map())

    // Get initial trade offers
    for (const offer of await api.game.trade.getSentOffers.query(teamID))
        tradeOffers.value.set(offer._id, offer)
    for (const offer of await api.game.trade.getReceivedOffers.query(teamID))
        tradeOffers.value.set(offer._id, offer)

    const tradeOffersArray = computed(() => Array.from(tradeOffers.value.values()))

    const sentOffers = computed(() =>
        tradeOffersArray.value.filter(
            (offer) => offer.sender === teamID && offer.archivedOn === undefined,
        ),
    )

    const sentOffersArchived = computed(() =>
        tradeOffersArray.value.filter(
            (offer) => offer.sender === teamID && offer.archivedOn !== undefined,
        ),
    )

    const receivedOffers = computed(() =>
        tradeOffersArray.value.filter(
            (offer) => offer.receiver === teamID && offer.archivedOn === undefined,
        ),
    )

    const receivedOffersArchived = computed(() =>
        tradeOffersArray.value.filter(
            (offer) => offer.receiver === teamID && offer.archivedOn !== undefined,
        ),
    )

    on('game.trade.offer', (offer) => {
        const sameStatus = tradeOffers.value.get(offer._id)?.status === offer.status

        tradeOffers.value.set(offer._id, offer)

        if (sameStatus) return

        const team = offer.sender === teamID ? offer.receiver : offer.sender
        const teamName = teamNames[team]

        if (offer.status === TradeOfferStatus.PENDING)
            toast.info(
                offer.sender === teamID
                    ? `You sent a trade offer to ${teamName}`
                    : `${teamName} sent you a trade offer`,
            )
        else if (offer.status === TradeOfferStatus.ACCEPTED)
            toast.info(
                offer.sender === teamID
                    ? `${teamName} accepted your trade offer`
                    : `You accepted a trade offer from ${teamName}`,
            )
        else if (offer.status === TradeOfferStatus.DECLINED)
            toast.info(
                offer.sender === teamID
                    ? `${teamName} declined your trade offer`
                    : `You declined a trade offer from ${teamName}`,
            )
        else if (offer.status === TradeOfferStatus.EXPIRED)
            toast.info(`Trade offer ${offer.sender === teamID ? 'to' : 'from'} ${teamName} expired`)
        else if (offer.status === TradeOfferStatus.CANCELLED)
            toast.info(
                offer.sender === teamID
                    ? `You cancelled your trade offer to ${teamName}`
                    : `${teamName} cancelled their trade offer`,
            )
    })

    type PendingTradeOffer = Omit<
        TradeOffer,
        '_id' | 'status' | 'sender' | 'receiver' | 'gameID' | 'expiresOn'
    >

    const defaultTradeOffer: PendingTradeOffer = {
        itemsOffer: [],
        cashOffer: 0,
        itemsRequest: [],
        cashRequest: 0,
    }

    const pendingTradeOffer = ref<PendingTradeOffer>(structuredClone(defaultTradeOffer))
    const pendingTradeOfferReceiver = ref<TeamID | null>(null)
    const pendingTradeOfferExpiresOn = ref<number | null>(null)

    async function createTradeOffer() {
        if (pendingTradeOfferReceiver.value === null) {
            throw new Error('No receiver selected')
        }

        if (pendingTradeOfferExpiresOn.value === null) {
            throw new Error('No expiry selected')
        }

        const offer: Omit<TradeOffer, '_id' | 'status'> = {
            gameID: gameStore.gameID,
            sender: teamID,
            receiver: pendingTradeOfferReceiver.value,
            expiresOn: pendingTradeOfferExpiresOn.value,
            ...pendingTradeOffer.value,
        }

        await api.game.trade.create.mutate(offer)

        pendingTradeOffer.value = structuredClone(defaultTradeOffer)
    }

    async function removeTradeOffer(_id: TradeOfferID) {
        await api.game.trade.remove.mutate(_id)
    }

    async function rejectTradeOffer(_id: TradeOfferID) {
        await api.game.trade.reject.mutate(_id)
    }

    async function acceptTradeOffer(_id: TradeOfferID) {
        await api.game.trade.accept.mutate(_id)
    }

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
            (acc, item) => acc + marketStore.itemPrice[item.itemKey] * item.quantity,
            0,
        )
        const marketValueRequested = offer.itemsRequest.reduce(
            (acc, item) => acc + marketStore.itemPrice[item.itemKey] * item.quantity,
            0,
        )
        const netMarketValue = marketValueRequested - marketValueOffered

        const tradeValue = netTradeValue - netMarketValue + offer.cashOffer - offer.cashRequest

        const tradeVolume = netTradeValue + netMarketValue + offer.cashOffer + offer.cashRequest

        const tradeFavourability =
            tradeValue === 0
                ? 0
                : Math.abs(tradeValue / tradeVolume) *
                  (tradeValue > 0 ? -1 : 1) *
                  (offer.sender === teamID ? 1 : -1)

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

    return defineStore('trade', () => {
        return {
            teamNames,

            tradeOffers,
            sentOffers,
            sentOffersArchived,
            receivedOffers,
            receivedOffersArchived,

            pendingTradeOffer,
            pendingTradeOfferReceiver,
            pendingTradeOfferExpiresOn,

            createTradeOffer,
            removeTradeOffer,
            acceptTradeOffer,
            rejectTradeOffer,

            calculateTradeStats,
        }
    })
})()
