<template>
    <div ref="container" class="w-full flex items-center justify-center gap-16 px-8">
        <div ref="manufacturing" class="basis-2/3">
            <Manufacturing class="max-w-4xl" />
        </div>

        <div class="flex flex-col basis-1/3" ref="text">
            <h1 class="text-2xl unica-one-regular pb-4">
                <i class="ri-building-3-fill"></i>
                Manufacturing
            </h1>
            <div class="space-y-4">
                <p ref="p1">Turn raw into revenue.</p>

                <p ref="p2">
                    Build your <b>production line</b>, add value to materials, and manage
                    <b>order fulfilment</b>.
                </p>

                <p ref="p3">
                    Can you deliver on time? Do you have the space and stock?
                    <b>Smarter systems</b> mean stronger profits.
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fx } from '~/utils'
import { animate, onScroll } from 'animejs'
import { useIntersectionObserver } from '~/composables/useIntersectionObserver'
import Manufacturing from './components/Manufacturing.vue'

const { element: container } = useIntersectionObserver('manufacturing')
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
