<template>
    <div class="flex flex-col gap-4">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Sender</TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead></TableHead>
                    <TableHead>Favourability</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>

            <TableBody v-if="tradeStore.receivedOffers.length || tradeStore.sentOffers.length">
                <TradeOffersItem
                    v-for="offer in tradeStore.receivedOffers"
                    :key="offer._id"
                    :offer="offer"
                />
                <TableRow v-if="tradeStore.receivedOffers.length && tradeStore.sentOffers.length">
                    <TableCell colspan="8" class="pointer-events-none"> </TableCell>
                </TableRow>
                <TradeOffersItem
                    v-for="offer in tradeStore.sentOffers"
                    :key="offer._id"
                    :offer="offer"
                />
            </TableBody>

            <TableBody v-else>
                <TableRow>
                    <TableCell colspan="8" class="text-center gap-1">
                        <i class="ri-error-warning-line"></i>
                        No Trade Offers
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>

        <Accordion type="single" collapsible>
            <AccordionItem value="archive">
                <AccordionTrigger>
                    <h4 class="scroll-m-20 text-xl text-center font-semibold">Archived</h4>
                </AccordionTrigger>
                <AccordionContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Sender</TableHead>
                                <TableHead></TableHead>
                                <TableHead></TableHead>
                                <TableHead>Recipient</TableHead>
                                <TableHead></TableHead>
                                <TableHead>Result</TableHead>
                                <TableHead class="text-right">Archived</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody v-if="archivedOffersSorted.length">
                            <TradeOffersItem
                                v-for="offer in archivedOffersSorted"
                                :key="offer._id"
                                :offer="offer"
                            />
                        </TableBody>

                        <TableBody v-else>
                            <TableRow>
                                <TableCell colspan="8" class="text-center gap-1">
                                    <i class="ri-error-warning-line"></i>
                                    No Trade Offers
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import TradeOffersItem from './TradeOffersItem.vue'

import { useTradeStore } from '~/modules/trade/trade.store'
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
    TableHead,
} from '~/components/ui/table'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '~/components/ui/accordion'

const tradeStore = (await useTradeStore)()

const archivedOffersSorted = computed(() => {
    return [...tradeStore.receivedOffersArchived, ...tradeStore.sentOffersArchived].sort(
        (a, b) => (b.archivedOn ?? 0) - (a.archivedOn ?? 0),
    )
})
</script>

<style scoped></style>
