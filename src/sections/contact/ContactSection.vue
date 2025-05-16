<template>
    <div
        ref="container"
        class="w-full flex flex-col h-screen items-center justify-center px-8 pr-12"
    >
        <h1 ref="title" class="text-2xl unica-one-regular pb-4">
            <i class="ri-mail-fill"></i>
            Get in touch
        </h1>

        <div class="space-y-12">
            <div ref="email" class="text-center">
                <a href="mailto:ed@unmnd.com" class="hover:text-muted-foreground transition-colors">
                    ed@unmnd.com
                </a>
            </div>

            <p ref="p1" class="text-sm opacity-75 mt-8 max-w-lg flex gap-12">
                <img :src="BathLogo" class="w-48 dark:hidden object-scale-down" />
                <img :src="BathLogoDark" class="w-48 hidden dark:block object-scale-down" />

                Strategic Success has been developed, tested and implemented in real business
                modules at the University of Bath.
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fx } from '~/utils'
import { animate, onScroll } from 'animejs'
import { useIntersectionObserver } from '~/composables/useIntersectionObserver'

import BathLogo from '~/assets/university-of-bath-logo-png-transparent.png'
import BathLogoDark from '~/assets/university-of-bath-logo-png-transparent-dark.png'

const { element: container } = useIntersectionObserver('contact')

const title = ref<HTMLElement | null>(null)
const email = ref<HTMLElement | null>(null)
const p1 = ref<HTMLElement | null>(null)

onMounted(() => {
    const elements = [title.value!, email.value!, p1.value!]
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
