<template>
    <div ref="container" class="w-screen min-h-screen flex flex-col items-center">
        <div class="pt-20 pb-8 max-w-3xl text-center" ref="text">
            <h1 class="text-2xl font-bold pb-4">
                <i class="ri-line-chart-fill"></i>
                Market
            </h1>
            <div class="space-y-4">
                <p ref="p1">A living, breathing economy.</p>

                <p ref="p2">
                    Prices of raw materials and products shift organically based on
                    <b>team activity</b> and <b>external news</b>. Supply and demand are king.
                </p>

                <p ref="p3">
                    From pandemics to political instability—reacting to <b>market shocks</b> is part
                    of the game.
                </p>
            </div>
        </div>

        <div
            ref="market"
            class="w-full max-w-6xl flex items-center justify-center p-4 mb-8 bg-card rounded-xl border"
        >
            <MarketItemInfo />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fx } from '~/utils'
import { animate, onScroll } from 'animejs'
import MarketItemInfo from './components/MarketItemInfo.vue'
import { useIntersectionObserver } from '~/composables/useIntersectionObserver'

const { element: container } = useIntersectionObserver('market')
const text = ref<HTMLElement | null>(null)
const p1 = ref<HTMLElement | null>(null)
const p2 = ref<HTMLElement | null>(null)
const p3 = ref<HTMLElement | null>(null)

onMounted(() => {
    // Animate text elements on scroll
    animate([text.value!, p1.value!, p2.value!, p3.value!], {
        ...fx.fadeUp,
        autoplay: onScroll({
            enter: '50% top',
            leave: '0 top',
            sync: 0.2,
        }),
    })
})
</script>

<style scoped></style>
