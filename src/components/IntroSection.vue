<template>
  <!-- <GenericSection id="intro" class="h-[200vh]"> -->
  <div
    ref="container"
    class="fixed top-0 w-full flex flex-col items-center justify-center h-screen text-center"
  >
    <div>
      <div ref="logo" class="opacity-0 scale-90">
        <Logo />
      </div>

      <p class="text-xl">
        <span ref="word1" class="opacity-0 inline-block mr-1">gamify</span>
        <span ref="word2" class="opacity-0 inline-block mr-1">learning.</span>
        <span ref="word3" class="opacity-0 inline-block mr-1">simulating</span>
        <span ref="word4" class="opacity-0 inline-block">success.</span>
      </p>
    </div>
  </div>
  <!-- </GenericSection> -->
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { createTimeline } from 'animejs'
import { useStageStore } from '../stores/stage'
import Logo from './MainLogo.vue'
import { pause } from '@/utils'

const store = useStageStore()
const container = ref<HTMLElement | null>(null)
const logo = ref<HTMLElement | null>(null)
const word1 = ref<HTMLElement | null>(null)
const word2 = ref<HTMLElement | null>(null)
const word3 = ref<HTMLElement | null>(null)
const word4 = ref<HTMLElement | null>(null)

onMounted(async () => {
  const tl = createTimeline()

  tl.add(logo.value!, {
    opacity: [0, 1],
    scale: [0.9, 1],
    duration: 1500,
    ease: 'outExpo',
  })

  tl.add(word1.value!, {
    opacity: [0, 1],
    translateY: ['10%', '0%'],
    duration: 1500,
    ease: 'outExpo',
  })

  tl.add(
    word2.value!,
    {
      opacity: [0, 1],
      translateY: ['10%', '0%'],
      duration: 1500,
      delay: 300,
      ease: 'outExpo',
    },
    '<<',
  )

  tl.add(word3.value!, {
    opacity: [0, 1],
    translateY: ['10%', '0%'],
    duration: 1500,
    ease: 'outExpo',
  })

  tl.add(
    word4.value!,
    {
      opacity: [0, 1],
      translateY: ['10%', '0%'],
      duration: 1500,
      delay: 300,
      ease: 'outExpo',
    },
    '<<',
  )

  pause(tl)

  tl.add(container.value!, {
    translateY: ['0%', '-50px'],
    opacity: [1, 0],
    ease: 'inExpo',
  })

  store.addTimeline('intro', tl)
})
</script>

<style scoped>
h1 {
  color: #333;
}

p {
  color: #555;
}
</style>
