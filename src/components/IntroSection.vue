<template>
  <GenericSection id="intro" class="h-[200vh]">
    <div
      ref="container"
      class="fixed top-0 w-full flex flex-col items-center justify-center h-screen text-center"
    >
      <div>
        <div ref="logo">
          <Logo />
        </div>

        <p class="text-2xl">
          <span ref="word1" class="opacity-0 inline-block mr-1">Gamify</span>
          <span ref="word2" class="opacity-0 inline-block mr-1">Learning.</span>
          <span ref="word3" class="opacity-0 inline-block mr-1">Simulate</span>
          <span ref="word4" class="opacity-0 inline-block">Success.</span>
        </p>
      </div>
    </div>
  </GenericSection>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { animate, onScroll, ScrollObserver, type AnimationParams, type TargetsParam } from 'animejs'
import { useStageStore } from '../stores/stage'
import GenericSection from './GenericSection.vue'
import Logo from './Logo.vue'
import { storeToRefs } from 'pinia'

const store = useStageStore()
const container = ref<HTMLElement | null>(null)
const logo = ref<HTMLElement | null>(null)
const word1 = ref<HTMLElement | null>(null)
const word2 = ref<HTMLElement | null>(null)
const word3 = ref<HTMLElement | null>(null)
const word4 = ref<HTMLElement | null>(null)

onMounted(async () => {
  animate(logo.value!, {
    opacity: [0, 1],
    scale: [0.9, 1],
    duration: 1500,
    ease: 'outExpo',
    autoplay: true,
  })

  const sectionElement = await store.getSection('intro')

  animate(word1.value!, {
    opacity: [0, 1],
    translateY: ['10%', '0%'],
    duration: 1500,
    ease: 'outExpo',
    autoplay: onScroll({
      target: sectionElement,
      enter: '-20%',
    }),
  })

  animate(word2.value!, {
    opacity: [0, 1],
    translateY: ['10%', '0%'],
    duration: 1500,
    delay: 300,
    ease: 'outExpo',
    autoplay: onScroll({
      target: sectionElement,
      enter: '-20%',
    }),
  })

  animate(word3.value!, {
    opacity: [0, 1],
    translateY: ['10%', '0%'],
    duration: 1500,
    ease: 'outExpo',
    autoplay: onScroll({
      target: sectionElement,
      enter: '-80%',
    }),
  })

  animate(word4.value!, {
    opacity: [0, 1],
    translateY: ['10%', '0%'],
    duration: 1500,
    delay: 300,
    ease: 'outExpo',
    autoplay: onScroll({
      target: sectionElement,
      enter: '-80%',
    }),
  })

  animate(container.value!, {
    // duration: 500,
    translateY: ['0%', '-50px'],
    opacity: [1, 0],
    ease: 'inExpo',
    autoplay: onScroll({
      target: sectionElement,
      enter: 'start 0%',
      leave: 'start end',
      sync: true,
    }),
  })
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
