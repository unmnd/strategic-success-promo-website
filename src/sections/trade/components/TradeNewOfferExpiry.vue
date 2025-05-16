<template>
    <div class="flex flex-col gap-2">
        <Label>Offer Expires</Label>

        <div class="flex gap-2">
            <Button
                type="button"
                variant="outline"
                class="w-10"
                @click="expiresOn = [CURRENT_ROUND + 1]"
            >
                <i class="ri-arrow-down-double-line"></i>
            </Button>

            <Slider
                v-model="expiresOn"
                :min="CURRENT_ROUND + 1"
                :max="LAST_ROUND_INDEX + 1"
                :step="1"
            />

            <Button
                type="button"
                variant="outline"
                class="w-10"
                @click="expiresOn = [LAST_ROUND_INDEX + 1]"
            >
                <i class="ri-infinity-line"></i>
            </Button>
        </div>

        <div class="flex gap-2">
            <!-- <div class="grow text-muted-foreground text-sm">When should this offer expire?</div> -->

            <div class="grow"></div>

            <div>
                {{ displayedText }}
            </div>
            <div v-if="displayedRound !== LAST_ROUND_INDEX + 2" class="text-muted-foreground">
                {{ displayedSubText }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import pluralise from 'pluralize'

import { Slider } from '~/components/ui/slider'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'

const LAST_ROUND_INDEX = 11
const CURRENT_ROUND = 1
const expiresOn = ref([CURRENT_ROUND + 1])

// watch(
//     expiresOn,
//     ([round]) => {
//         tradeStore.pendingTradeOfferExpiresOn = round
//     },
//     { immediate: true },
// )

const displayedRound = computed(() => expiresOn.value[0] + 1)

const displayedText = computed(() => {
    if (displayedRound.value === LAST_ROUND_INDEX + 2) {
        return 'No Expiry'
    }

    return `Round ${displayedRound.value}`
})

const displayedSubText = computed(() => {
    return `(after ${pluralise('round', expiresOn.value[0] - CURRENT_ROUND, true)})`
})
</script>

<style scoped></style>
