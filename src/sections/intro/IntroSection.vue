<template>
    <div
        ref="container"
        class="relative w-full h-screen flex flex-col items-center justify-center text-center"
    >
        <div ref="logo" class="opacity-0">
            <Logo />
        </div>

        <p class="text-lg tracking-wide">
            <span ref="word1" class="opacity-0 inline-block mr-1">gamify</span>
            <span ref="word2" class="opacity-0 inline-block mr-1">learning.</span>
            <span ref="word3" class="opacity-0 inline-block mr-1">simulating</span>
            <span ref="word4" class="opacity-0 inline-block">success.</span>
        </p>

        <div
            ref="scrollPrompt"
            class="absolute bottom-8 inset-x-0 mx-auto w-fit flex flex-col items-center gap-1 opacity-0 pr-12"
        >
            <p class="text-zinc-500 text-sm font-medium">scroll</p>
            <div class="animate-bounce">
                <div class="w-3 h-3 border-r border-b border-zinc-500 rotate-45"></div>
            </div>
        </div>
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
const scrollPrompt = ref<HTMLElement | null>(null)
onMounted(() => {
    // Add logo animation
    createTimeline()
        .add(logo.value!, fx.fadeIn, '+=1000')

        // Add word animations
        .add(word1.value!, fx.fadeUp)
        .add(word2.value!, fx.fadeUp, '<<+=300')
        .add(word3.value!, fx.fadeUp)
        .add(word4.value!, fx.fadeUp, '<<+=300')
        .add(scrollPrompt.value!, fx.fadeIn, '+=1000')
})
</script>

<style scoped></style>
