<template>
    <div ref="container" class="w-full flex flex-col items-center">
        <div class="pt-20 pb-8 max-w-3xl text-center" ref="text">
            <h1 class="text-2xl font-bold pb-4">
                <i class="ri-exchange-funds-fill"></i>
                Trade
            </h1>
            <div class="space-y-4">
                <p ref="p1">Negotiate your way to the top.</p>

                <p ref="p2">
                    Teams can trade <b>commodities</b>, <b>products</b>, and <b>cash</b> directly
                    with each other.
                </p>

                <p ref="p3">
                    Drive a hard bargain, broker deals, or build alliances—it's all part of the
                    strategy.
                </p>
            </div>
        </div>

        <div
            ref="trade"
            class="w-full max-w-6xl flex items-center justify-center p-4 mb-8 bg-card rounded-xl border"
        >
            <!-- Placeholder for future trade component -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fx } from '~/utils'
import { animate, onScroll } from 'animejs'
import { useIntersectionObserver } from '~/composables/useIntersectionObserver'

const { element: container } = useIntersectionObserver('trade')
const text = ref<HTMLElement | null>(null)
const p1 = ref<HTMLElement | null>(null)
const p2 = ref<HTMLElement | null>(null)
const p3 = ref<HTMLElement | null>(null)

onMounted(() => {
    const elements = [text.value!, p1.value!, p2.value!, p3.value!]
    for (const el of elements) {
        animate(el, {
            ...fx.fadeUp,
            autoplay: onScroll({
                enter: '70% top',
                leave: '0 top',
                sync: 0.2,
            }),
        })
    }
})
</script>

<style scoped>
/* Add any section-specific styles here */
</style>
