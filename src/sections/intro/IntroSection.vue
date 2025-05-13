<template>
    <div
        ref="container"
        class="w-screen h-screen flex flex-col items-center justify-center text-center"
    >
        <div ref="logo" class="opacity-0">
            <Logo />
        </div>

        <p class="text-xl text-muted-foreground">
            <span ref="word1" class="opacity-0 inline-block mr-1">gamify</span>
            <span ref="word2" class="opacity-0 inline-block mr-1">learning.</span>
            <span ref="word3" class="opacity-0 inline-block mr-1">simulating</span>
            <span ref="word4" class="opacity-0 inline-block">success.</span>
        </p>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Logo from '~/components/MainLogo.vue'
import { fx } from '~/utils'
import { createTimeline } from 'animejs'
import { useIntersectionObserver } from '~/composables/useIntersectionObserver'

const { element: container } = useIntersectionObserver('intro')

const logo = ref<HTMLElement | null>(null)
const word1 = ref<HTMLElement | null>(null)
const word2 = ref<HTMLElement | null>(null)
const word3 = ref<HTMLElement | null>(null)
const word4 = ref<HTMLElement | null>(null)

onMounted(() => {
    // Add logo animation
    createTimeline()
        .add(logo.value!, fx.fadeIn, '+=1000')

        // Add word animations
        .add(word1.value!, fx.fadeUp)
        .add(word2.value!, fx.fadeUp, '<<+=300')
        .add(word3.value!, fx.fadeUp)
        .add(word4.value!, fx.fadeUp, '<<+=300')
})
</script>

<style scoped></style>
