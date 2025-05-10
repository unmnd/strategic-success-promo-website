<template>
  <img
    ref="image"
    v-show="src"
    :src="src || undefined"
    class="fixed inset-0 object-cover w-screen h-screen"
  />
  <div ref="black" class="fixed inset-0 bg-background"></div>
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
const srcLoaded = ref<Promise<void> | null>(null)

const tl = ref<Timeline>(createTimeline({ autoplay: true }))

watch(
  () => backgroundStore.currentBackground,
  (newSrc) => {
    tl.value.cancel()

    srcLoaded.value = new Promise((resolve) => {
      image.value!.addEventListener('load', () => {
        resolve()
      })
    })

    tl.value = createTimeline({ autoplay: true })
      .add(black.value!, {
        opacity: 1,
        duration: 5000 * parseFloat(black.value!.style?.opacity || '0'),
      })

      .call(() => {
        src.value = newSrc
      }, '+=0')

      .call(async () => {
        await srcLoaded.value!
      }, '+=0')

      .add(black.value!, { opacity: 1 - BACKGROUND_OPACITY, duration: 5000 }, '+=10')
      .add(image.value!, { filter: ['blur(40px)', 'blur(0px)'], duration: 10000 }, '<<')
  },
)
</script>

<style scoped></style>
