<template>
    <div ref="container" class="w-full flex items-center justify-center gap-16 px-8">
        <div class="flex flex-col basis-1/3 text-right" ref="text">
            <h1 ref="title" class="text-2xl unica-one-regular pb-4">
                <i class="ri-team-fill"></i>
                Partnerships
            </h1>
            <div class="space-y-4">
                <p ref="p1" class="font-bold">Build something bigger.</p>

                <p ref="p2">
                    Form strategic alliances between businesses. Set terms like
                    <b>profit sharing</b>, <b>loan agreements</b>, <b>non-competes</b>, or
                    <b>exclusivity clauses</b>. Create your own rules—and play by them.
                </p>
            </div>
        </div>

        <div
            ref="partnershipForm"
            class="basis-1/2 w-full flex items-center justify-center p-4 mb-8"
        >
            <PartnershipFormClauseNewClause />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fx } from '~/utils'
import { animate, onScroll } from 'animejs'
import { useIntersectionObserver } from '~/composables/useIntersectionObserver'

import PartnershipFormClauseNewClause from './components/PartnershipFormClauseNewClause.vue'

const { element: container } = useIntersectionObserver('partnerships')
const title = ref<HTMLElement | null>(null)
const partnershipForm = ref<HTMLElement | null>(null)
const p1 = ref<HTMLElement | null>(null)
const p2 = ref<HTMLElement | null>(null)

onMounted(() => {
    const elements = [title.value!, p1.value!, p2.value!]
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

    // Main content animation
    animate(partnershipForm.value!, {
        ...fx.fadeIn,
        autoplay: onScroll({
            enter: '70% top',
            leave: '0 top',
            sync: 0.2,
        }),
    })
})
</script>

<style scoped></style>
