<template>
  <div
    ref="container"
    class="fixed top-0 w-full flex flex-col items-center justify-center h-screen text-center"
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
import { useStageStore } from '../../stores/stage'
import Logo from '~/components/MainLogo.vue'
import { fx } from '~/utils'

const store = useStageStore()

const container = ref<HTMLElement | null>(null)
const background = ref<HTMLElement | null>(null)
const logo = ref<HTMLElement | null>(null)
const word1 = ref<HTMLElement | null>(null)
const word2 = ref<HTMLElement | null>(null)
const word3 = ref<HTMLElement | null>(null)
const word4 = ref<HTMLElement | null>(null)

onMounted(() => {
  // Create a checkpoint at the beginning
  store.createCheckpoint('intro')

  // Add logo animation
  store.timeline.add(logo.value!, fx.fadeIn)

  // Add word animations
  store.timeline.add(word1.value!, fx.fadeUp)
  store.timeline.add(word2.value!, fx.fadeUp, '<<+=300')
  store.timeline.add(word3.value!, fx.fadeUp)
  store.timeline.add(word4.value!, fx.fadeUp, '<<+=300')

  // Add a pause here
  store.timeline.call(() => {
    store.pauseTimeline()
  })

  store.timeline.add(container.value!, {
    translateY: ['0%', '-50px'],
    opacity: [1, 0],
    ease: 'inExpo',
  })

  store.timeline.add(
    background.value!,
    {
      opacity: [1, 0],
      duration: 1500,
      easing: 'easeInExpo',
    },
    '+=0',
  )
})
</script>

<style scoped></style>
