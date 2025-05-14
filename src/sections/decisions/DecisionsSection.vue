<template>
    <div ref="container" class="w-full h-screen flex items-center justify-center gap-16 px-8">
        <div ref="decisions" class="basis-2/3">
            <Decisions class="max-w-4xl" />
        </div>

        <div class="flex flex-col basis-1/3" ref="text">
            <h1 class="text-2xl font-bold pb-4">
                <i class="ri-briefcase-2-fill"></i>
                Decisions
            </h1>
            <div class="space-y-4">
                <p ref="p1">
                    Every choice matters. Teams are faced with
                    <b>realistic business decisions</b> that impact performance across finance,
                    production, and strategy.
                </p>

                <p ref="p2">
                    From <b>pricing and hiring</b>, to <b>ethical dilemmas</b> and
                    <b>risk management</b>— there's no autopilot here.
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Decisions from './Decisions.vue'
import { onMounted, ref } from 'vue'
import { fx } from '~/utils'
import { animate, onScroll } from 'animejs'
import { useIntersectionObserver } from '~/composables/useIntersectionObserver'
import { useDecisionsStore } from './decisions.store'

const { element: container } = useIntersectionObserver('decisions')
const decisions = ref<HTMLElement | null>(null)
const text = ref<HTMLElement | null>(null)
const p1 = ref<HTMLElement | null>(null)
const p2 = ref<HTMLElement | null>(null)

const decisionsStore = useDecisionsStore()

onMounted(() => {
    const elements = [text.value!, p1.value!, p2.value!]
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

    animate(decisions.value!, {
        autoplay: onScroll({}),
        onBegin: () => {
            if (decisionsStore.decisions.includes('expandWarehouse')) return

            setTimeout(() => {
                decisionsStore.addDecision('expandWarehouse')
            }, 3000)
        },
    })
})
</script>

<style scoped></style>
