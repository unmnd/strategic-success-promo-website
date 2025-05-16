<template>
    <form class="flex flex-col gap-4 w-full">
        <div class="flex flex-col gap-2 px-1 pb-4 border-b">
            <h4 class="scroll-m-20 text-xl font-semibold">Send</h4>
            <TradeNewOfferItems type="offer"></TradeNewOfferItems>
            <TradeNewOfferCash v-model="cashOffer"> Additional Cash </TradeNewOfferCash>
        </div>

        <div class="flex flex-col gap-2 px-1 pb-4 border-b">
            <h4 class="scroll-m-20 text-xl font-semibold">Receive</h4>
            <TradeNewOfferItems type="request"></TradeNewOfferItems>
            <TradeNewOfferCash v-model="cashRequest"> Additional Cash </TradeNewOfferCash>
        </div>

        <TradeNewOfferExpiry></TradeNewOfferExpiry>

        <TradeNewOfferStats></TradeNewOfferStats>

        <Button class="md:w-64 self-end" type="submit">Send</Button>
    </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

import TradeNewOfferItems from './TradeNewOfferItems.vue'
import TradeNewOfferCash from './TradeNewOfferCash.vue'
import TradeNewOfferExpiry from './TradeNewOfferExpiry.vue'
import TradeNewOfferStats from './TradeNewOfferStats.vue'

import { Button } from '~/components/ui/button'
import { useTradeStore } from '../trade.store'

const tradeStore = useTradeStore()

const cashOffer = ref(tradeStore.pendingTradeOffer.cashOffer / 100)
const cashRequest = ref(tradeStore.pendingTradeOffer.cashRequest / 100)

watch(cashOffer, (value) => {
    tradeStore.pendingTradeOffer.cashOffer = Math.round(value * 100)
})

watch(
    () => tradeStore.pendingTradeOffer.cashOffer,
    (value) => {
        cashOffer.value = value / 100
    },
)

watch(cashRequest, (value) => {
    tradeStore.pendingTradeOffer.cashRequest = Math.round(value * 100)
})

watch(
    () => tradeStore.pendingTradeOffer.cashRequest,
    (value) => {
        cashRequest.value = value / 100
    },
)
</script>

<style scoped></style>
