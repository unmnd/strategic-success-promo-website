<template>
    <Card class="w-full">
        <!-- <CardHeader class="flex flex-row justify-between">
        <CardTitle>Decisions</CardTitle>
      </CardHeader> -->

        <CardContent>
            <div class="divide-y divide-border relative">
                <TransitionGroup name="list">
                    <div
                        v-for="decision in decisions"
                        :key="decision"
                        class="grid grid-cols-[min-content_1fr_min-content] items-center py-4 px-4 hover:bg-muted/50"
                    >
                        <div class="text-sm w-64">{{ EFFECT_INFO[decision].actionName }}</div>
                        <div class="text-muted-foreground text-sm line-clamp-2 px-4">
                            {{ EFFECT_INFO[decision].description.summary }}
                        </div>
                        <div class="text-right w-min">
                            <Button variant="outline" @click="selectedEffect = decision">
                                Info
                            </Button>
                        </div>
                    </div>
                    <div
                        v-if="decisions.length === 0"
                        class="flex items-center text-muted-foreground justify-center w-full h-full gap-2"
                    >
                        <i class="ri-error-warning-line"></i>
                        <p>No decisions available</p>
                    </div>
                </TransitionGroup>
            </div>
        </CardContent>

        <EffectInfo
            :info="selectedEffectInfo"
            :active="false"
            :visibility="'SELECTABLE'"
            @close="selectedEffect = undefined"
            @select="selectDecision"
        />
    </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import EffectInfo from './EffectInfo.vue'

import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { EFFECT_INFO } from './decisions.config'
import { useDecisionsStore } from './decisions.store'
import { storeToRefs } from 'pinia'

const decisionStore = useDecisionsStore()

const { selectDecision } = decisionStore
const { decisions, selectedEffect } = storeToRefs(decisionStore)

const selectedEffectInfo = computed(() =>
    selectedEffect.value ? EFFECT_INFO[selectedEffect.value] : undefined,
)
</script>

<style scoped>
.list-move, /* apply transition to moving elements */
  .list-enter-active,
  .list-leave-active {
    transition: all 0.5s ease;
}

.list-leave-to,
.list-enter-from {
    opacity: 0;
    transform: translateY(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
     animations can be calculated correctly. */
.list-leave-active {
    position: absolute;
}
</style>
