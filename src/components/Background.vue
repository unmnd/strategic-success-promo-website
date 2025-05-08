<template>
  <img
    ref="background"
    v-if="src"
    :src="src"
    class="fixed inset-0 object-cover w-screen h-screen"
  />
  <div ref="black" class="fixed inset-0 bg-background"></div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useBackgroundStore } from '~/stores/background'
import { createTimeline, Timeline } from 'animejs'

const backgroundStore = useBackgroundStore()

const background = ref<HTMLElement | null>(null)

const src = ref(backgroundStore.currentBackground)
const black = ref<HTMLElement | null>(null)

const tl = ref<Timeline>(createTimeline({ autoplay: true }))

watch(
  () => backgroundStore.currentBackground,
  (newSrc) => {
    tl.value.cancel()

    tl.value = createTimeline({ autoplay: true })

    tl.value.add(black.value!, {
      opacity: 1,
      //   duration: () => 2000 * parseFloat(black.value!.style?.opacity || '0'),
      duration: 2000,
    })

    tl.value.call(() => {
      src.value = newSrc
    }, '+=0')

    tl.value.add(black.value!, { opacity: 0.5, duration: 5000 }, '+=0')
  },
  { immediate: true },
)
</script>

<style scoped></style>
