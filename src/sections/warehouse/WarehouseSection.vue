<template>
    <div ref="container" class="w-screen min-h-screen flex items-center gap-16 px-8">
        <div class="pt-20 pb-8 max-w-3xl text-center">
            <h1 ref="title" class="text-2xl font-bold pb-4">
                <i class="ri-store-2-fill"></i>
                Warehouse
            </h1>
            <div class="space-y-4">
                <p ref="p1">Every square metre counts.</p>

                <p ref="p2">
                    Storage isn't infinite—use it wisely. Stockpile strategically or run lean to
                    stay agile.
                </p>

                <p ref="p3">Mismanaging your inventory can cost more than just space.</p>
            </div>
        </div>

        <div ref="warehouse" class="basis-2/3 w-full flex items-center justify-center p-4 mb-8">
            <Warehouse />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fx } from '~/utils'
import { animate, onScroll } from 'animejs'
import Warehouse from './components/Warehouse.vue'
import { useIntersectionObserver } from '~/composables/useIntersectionObserver'

const { element: container } = useIntersectionObserver('warehouse')
const title = ref<HTMLElement | null>(null)
const p1 = ref<HTMLElement | null>(null)
const p2 = ref<HTMLElement | null>(null)
const p3 = ref<HTMLElement | null>(null)

onMounted(() => {
    const elements = [title.value!, p1.value!, p2.value!, p3.value!]
    elements.forEach((el, i) => {
        animate(el, {
            ...fx.fadeUp,
            autoplay: onScroll({
                enter: '70% top',
                leave: '0 top',
                sync: 0.2,
            }),
        })
    })
})
</script>

<style scoped></style>
