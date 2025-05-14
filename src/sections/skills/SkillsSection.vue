<template>
    <div ref="container" class="w-full h-screen flex items-center justify-center gap-16 px-8">
        <div class="flex flex-col basis-1/3 text-right" ref="text">
            <h1 class="text-2xl font-bold pb-4">
                <i class="ri-brain-fill"></i>
                Skills
            </h1>
            <div class="space-y-4">
                <p ref="p1">Invest in what sets you apart.</p>

                <p ref="p2">
                    Each team chooses where to specialise—be it <b>logistics</b>, <b>marketing</b>,
                    <b>finance</b>, or more. Time and money spent on skills determines your
                    competitive edge.
                </p>

                <p ref="p3">Will you be a jack-of-all-trades or a focused powerhouse?</p>
            </div>
        </div>

        <div ref="skills" class="basis-2/3 max-w-3xl">
            <SkillTree />
        </div>
    </div>
</template>

<script setup lang="ts">
import SkillTree from './SkillTree.vue'
import { onMounted, ref } from 'vue'
import { fx } from '~/utils'
import { animate, onScroll } from 'animejs'
import { useIntersectionObserver } from '~/composables/useIntersectionObserver'

const { element: container } = useIntersectionObserver('skills')
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

<style scoped></style>
