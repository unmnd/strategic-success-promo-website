<template>
    <div
        ref="container"
        class="inset-0 absolute px-8 overflow-y-scroll min-h-screen w-full flex items-center gap-16"
    >
        <div class="pt-20 pb-8 max-w-3xl text-center opacity-0" ref="text">
            <h1 class="text-2xl font-bold pb-4">
                <i class="ri-store-2-fill"></i>
                Warehouse
            </h1>
            <div class="space-y-4">
                <p ref="p1" class="opacity-0">Every square metre counts.</p>

                <p ref="p2" class="opacity-0">
                    Storage isn't infinite—use it wisely. Stockpile strategically or run lean to
                    stay agile.
                </p>

                <p ref="p3" class="opacity-0">
                    Mismanaging your inventory can cost more than just space.
                </p>
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
import { createTimeline, stagger } from 'animejs'
import Warehouse from './components/Warehouse.vue'

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
