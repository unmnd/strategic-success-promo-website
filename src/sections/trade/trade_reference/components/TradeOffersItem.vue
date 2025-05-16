<template>
    <TableRow>
        <TableCell>
            <Badge :variant="offer.sender === authStore.getUser()._id ? 'default' : 'outline'">
                {{
                    offer.sender === authStore.getUser()._id
                        ? 'You'
                        : (tradeStore.teamNames[offer.sender] ?? 'Unknown')
                }}
            </Badge>
        </TableCell>

        <TableCell>
            <ItemsList
                v-if="offer.itemsOffer.length !== 0 || cashExchange > 0"
                :items="offer.itemsOffer"
                :cash="cashExchange > 0 ? cashExchange : undefined"
            />

            <div v-else class="flex items-center text-muted-foreground gap-1">
                <i class="ri-error-warning-line"></i>
                No items
            </div>
        </TableCell>

        <TableCell>
            <i class="ri-expand-horizontal-s-line"></i>
        </TableCell>

        <TableCell>
            <Badge :variant="offer.receiver === authStore.getUser()._id ? 'default' : 'outline'">
                {{
                    offer.receiver === authStore.getUser()._id
                        ? 'You'
                        : (tradeStore.teamNames[offer.receiver] ?? 'Unknown')
                }}
            </Badge>
        </TableCell>

        <TableCell>
            <ItemsList
                v-if="offer.itemsRequest.length !== 0 || cashExchange < 0"
                :items="offer.itemsRequest"
                :cash="cashExchange < 0 ? -cashExchange : undefined"
            />

            <div v-else class="flex items-center text-muted-foreground gap-1">
                <i class="ri-error-warning-line"></i>
                No items
            </div>
        </TableCell>

        <TableCell v-if="offer.archivedOn === undefined">
            <span v-if="Math.round(tradeFavourability * 100) < 0">
                <i class="ri-arrow-down-s-line text-red-500"></i>
                {{ Math.round(Math.abs(tradeFavourability) * 100) }}% in their favour
            </span>

            <span v-else-if="Math.round(tradeFavourability * 100) > 0">
                <i class="ri-arrow-up-s-line text-green-400"></i>
                {{ Math.round(tradeFavourability * 100) }}% in your favour
            </span>

            <span v-else>
                <i class="ri-check-line text-muted-foreground"></i>
                Fair trade
            </span>
        </TableCell>

        <TableCell v-if="offer.archivedOn === undefined">
            {{ expiresText }}
        </TableCell>

        <TableCell v-else>
            <span v-if="offer.status === TradeOfferStatus.ACCEPTED">
                <i class="ri-check-line text-green-400"></i>
                Accepted
            </span>

            <span v-else-if="offer.status === TradeOfferStatus.DECLINED">
                <i class="ri-close-line text-red-500"></i>
                Declined
            </span>

            <span v-else-if="offer.status === TradeOfferStatus.EXPIRED">
                <i class="ri-time-line text-muted-foreground"></i>
                Expired
            </span>

            <span v-else-if="offer.status === TradeOfferStatus.CANCELLED">
                <i class="ri-close-line text-muted-foreground"></i>
                Cancelled
            </span>

            <span v-else-if="offer.status === TradeOfferStatus.FAILED">
                <i class="ri-error-warning-line text-red-500"></i>
                Failed
            </span>
        </TableCell>

        <TableCell class="text-right" v-if="offer.archivedOn !== undefined">
            <Badge variant="outline"> Round {{ offer.archivedOn + 1 }} </Badge>
        </TableCell>

        <TableCell class="text-right" v-if="offer.archivedOn === undefined">
            <span v-if="offer.status === TradeOfferStatus.FAILED" class="text-red-500">
                <TooltipProvider>
                    <Tooltip :delayDuration="0">
                        <TooltipTrigger>
                            <Button variant="outline" size="icon" class="mr-2">
                                <i class="ri-error-warning-line"></i>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent class="!z-[1]">
                            <div class="text-sm text-red-500">
                                {{ offer.statusText }}
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </span>

            <Button
                v-if="offer.sender === authStore.getUser()._id"
                variant="outline"
                size="icon"
                @click="tradeStore.removeTradeOffer(offer._id)"
            >
                <i class="ri-delete-bin-line"></i>
            </Button>

            <AlertDialog v-else>
                <AlertDialogTrigger>
                    <Button class="mr-2" variant="outline" size="icon" @click="action = 'reject'">
                        <i class="ri-close-line"></i>
                    </Button>
                    <Button variant="outline" size="icon" @click="action = 'accept'">
                        <i class="ri-check-line"></i>
                    </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {{ action === 'accept' ? 'Accept' : 'Reject' }} Trade Offer
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to {{ action }} this trade offer?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel class="mr-auto"> Cancel </AlertDialogCancel>
                        <AlertDialogAction @click="performAction">
                            {{ action === 'accept' ? 'Accept' : 'Reject' }}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </TableCell>
    </TableRow>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import { TableCell, TableRow } from '~/components/ui/table'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '~/components/ui/alert-dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import type { TradeOffer } from '@/game/trade/trade.interface'
import { TradeOfferStatus } from '@/game/trade/trade.interface.enum'
import { useTradeStore } from '~/modules/trade/trade.store'
import { useGameStore } from '~/modules/team/modules/game/game.store'
import { useAuthStore } from '~/modules/auth/auth.store'
import ItemsList from '~/modules/item/components/ItemsList.vue'

const tradeStore = (await useTradeStore)()
const gameStore = (await useGameStore)()
const authStore = useAuthStore()

const props = defineProps<{
    offer: TradeOffer
}>()

const expiresText = computed(() => {
    if (props.offer.expiresOn > gameStore.lastRoundIndex) {
        return "Good 'til cancelled"
    }

    const expires = props.offer.expiresOn - gameStore.currentRound

    if (expires === 1) {
        return 'Next round'
    }

    return `In ${expires} rounds`
})

const cashExchange = computed(() => {
    const senderPay =
        props.offer.itemsRequest.reduce((acc, item) => {
            return acc + item.price * item.quantity
        }, 0) + props.offer.cashOffer

    const receiverPay =
        props.offer.itemsOffer.reduce((acc, item) => {
            return acc + item.price * item.quantity
        }, 0) + props.offer.cashRequest

    return senderPay - receiverPay
})

const tradeFavourability = computed(() => {
    const { tradeFavourability } = tradeStore.calculateTradeStats(props.offer)
    return tradeFavourability
})

const action = ref<'accept' | 'reject'>('accept')

async function performAction() {
    if (action.value === 'accept') {
        await tradeStore.acceptTradeOffer(props.offer._id)
    } else {
        await tradeStore.rejectTradeOffer(props.offer._id)
    }
}
</script>

<style scoped></style>
