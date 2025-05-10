<template>
    <div ref="container" class="inset-0 absolute px-8 overflow-y-scroll">
        <div class="relative w-full flex flex-col items-center">
            <div class="pt-20 pb-8 max-w-3xl text-center opacity-0" ref="text">
                <h1 class="text-2xl font-bold pb-4">
                    <i class="ri-line-chart-fill"></i>
                    Market
                </h1>
                <div class="space-y-4">
                    <p ref="p1" class="opacity-0">A living, breathing economy.</p>

                    <p ref="p2" class="opacity-0">
                        Prices of raw materials and products shift organically based on
                        <b>team activity</b> and <b>external news</b>. Supply and demand are king.
                    </p>

                    <p ref="p3" class="opacity-0">
                        From pandemics to political instability—reacting to <b>market shocks</b> is
                        part of the game.
                    </p>
                </div>
            </div>

            <div
                ref="market"
                class="min-h-screen w-full max-w-6xl flex items-center justify-center p-4 mb-8 bg-card rounded-xl border"
            >
                <MarketItemInfo />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fx } from '~/utils'
import { createTimeline, stagger } from 'animejs'

import MarketItemInfo from './components/MarketItemInfo.vue'

const text = ref<HTMLElement | null>(null)

const p1 = ref<HTMLElement | null>(null)
const p2 = ref<HTMLElement | null>(null)
const p3 = ref<HTMLElement | null>(null)

onMounted(() => {
    // Setup timeline
    createTimeline().add(
        [text.value!, p1.value!, p2.value!, p3.value!],
        {
            ...fx.fadeUp,
            delay: stagger(500),
        },
        '+=500',
    )
})
</script>

<style scoped></style>
