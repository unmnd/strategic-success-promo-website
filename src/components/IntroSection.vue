<template>
  <GenericSection ref="section" id="intro" class="h-[200vh]">
    <div class="fixed top-0 w-full flex flex-col items-center justify-center h-screen text-center">
      <div ref="container">
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

const store = useStageStore()
const container = ref<HTMLElement | null>(null)
const logo = ref<HTMLElement | null>(null)
const word1 = ref<HTMLElement | null>(null)
const word2 = ref<HTMLElement | null>(null)
const word3 = ref<HTMLElement | null>(null)
const word4 = ref<HTMLElement | null>(null)

const section = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!section.value) {
    console.error('IntroSection: section is required')
    return
  }

  const sectionElement = section.value

  animate(logo.value!, {
    opacity: [0, 1],
    scale: [0.9, 1],
    duration: 500,
    easing: 'easeOutExpo',
    autoplay: onScroll({
      target: sectionElement,
    }),
  })

  animate(word1.value!, {
    opacity: [0, 1],
    translateY: ['10%', '0%'],
    duration: 500,
    easing: 'easeOutExpo',
    autoplay: onScroll({
      target: sectionElement,
      enter: '-10%',
    }),
  })

  animate(word2.value!, {
    opacity: [0, 1],
    translateY: ['10%', '0%'],
    duration: 500,
    delay: 100,
    easing: 'easeOutExpo',
    autoplay: onScroll({
      target: sectionElement,
      enter: '-10%',
    }),
  })

  animate(word3.value!, {
    opacity: [0, 1],
    translateY: ['10%', '0%'],
    duration: 500,
    easing: 'easeOutExpo',
    autoplay: onScroll({
      target: sectionElement,
      enter: '-30%',
    }),
  })

  animate(word4.value!, {
    opacity: [0, 1],
    translateY: ['10%', '0%'],
    duration: 500,
    delay: 100,
    easing: 'easeOutExpo',
    autoplay: onScroll({
      target: sectionElement,
      enter: '-30%',
    }),
  })

  animate(container.value!, {
    scale: [1, 0.9],
    // duration: 500,
    // translateY: ['0%', '-100%'],
    // opacity: [1, 0],
    autoplay: onScroll({
      target: sectionElement,
      enter: 'start 0',
      leave: 'end 0',
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
