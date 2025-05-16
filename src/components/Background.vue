<template>
    <img
        ref="image"
        v-show="src"
        :src="src || undefined"
        class="fixed inset-0 object-cover w-screen h-screen z-[-1]"
    />
    <div ref="black" class="fixed inset-0 bg-background z-[-1]"></div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useBackgroundStore } from '~/stores/background'
import { createTimeline, Timeline } from 'animejs'

const BACKGROUND_OPACITY = 0.3

const backgroundStore = useBackgroundStore()

const image = ref<HTMLElement | null>(null)
const black = ref<HTMLElement | null>(null)

const src = ref(backgroundStore.currentBackground)

const tl = ref<Timeline>(createTimeline({ autoplay: true }))

// Function to preload an image
const preloadImage = (url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (!url) {
            resolve()
            return
        }

        const img = new Image()
        img.onload = () => resolve()
        img.onerror = reject
        img.src = url
    })
}

watch(
    () => backgroundStore.currentBackground,
    async (newSrc) => {
        if (!newSrc || newSrc === src.value) return

        tl.value.cancel()

        try {
            // Preload the new image before starting the transition
            await preloadImage(newSrc)

            tl.value = createTimeline({ autoplay: true })
                .add(black.value!, {
                    opacity: 1,
                    duration: 500,
                    ease: 'outExpo',
                })
                // Only change the source after the black overlay is fully visible
                .call(() => {
                    src.value = newSrc
                }, '+=0')
                // Give a small delay for the DOM to update
                .add({}, { duration: 100 })
                // Fade in the new image
                .add(
                    black.value!,
                    {
                        opacity: 1 - BACKGROUND_OPACITY,
                        duration: 2000,
                    },
                    '+=10',
                )
                .add(
                    image.value!,
                    { filter: ['blur(40px)', 'blur(0px)'], duration: 5000, ease: 'outExpo' },
                    '<<',
                )
        } catch (error) {
            console.error('Failed to load background image:', error)
            // Fallback: just set the source without animation if loading fails
            src.value = newSrc
        }
    },
)
</script>

<style scoped></style>
