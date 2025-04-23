<template>
  <GenericSection ref="animateInStage" id="animateInStage" class="h-screen">
    <div ref="scrollTracker"></div>
  </GenericSection>

  <div class="fixed top-0 h-screen w-screen flex items-center justify-center" ref="container">
    <div
      class="relative shrink-0 w-[1200px] h-[720px] bg-zinc-950 text-foreground border border-zinc-800 rounded-2xl select-none pointer-events-none"
    >
      <div
        class="overflow-scroll inset-0 absolute"
        ref="scrollContainer"
        @wheel.prevent
        @touchmove.prevent
      >
        <div class="flex flex-col mx-auto gap-4 p-8">
          <img src="../assets/screenshots/title.png" />

          <HeaderImage />

          <ImageNatural>
            <img src="../assets/screenshots/decisions_1.png" />
          </ImageNatural>

          <ImageNatural>
            <img src="../assets/screenshots/decisions_2.png" />
          </ImageNatural>

          <ImageNatural>
            <img src="../assets/screenshots/decisions_3.png" />
          </ImageNatural>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ImageNatural from './ImageNatural.vue'
import HeaderImage from './HeaderImage.vue'
import { onMounted, ref } from 'vue'
import { useStageStore } from '../stores/stage'
import GenericSection from './GenericSection.vue'
import { animate, onScroll } from 'animejs'

const container = ref<HTMLElement | null>(null)

const scrollContainer = ref<HTMLElement | null>(null)

const animateInStage = ref<HTMLElement | null>(null)

const scrollTracker = ref<HTMLElement | null>(null)
// You can now use scrollContainer.value.scrollTo() to programmatically control scrolling

const stageStore = useStageStore()

if (!animateInStage) {
  console.error('MainStage: main section is required')
  throw new Error('MainStage: main section is required')
}

// Animate appearance of the stage at section
onMounted(() => {
  // Section 1: Animate in the stage
  animate(container.value!, {
    translateY: ['100vh', '0'],
    easing: 'easeOutExpo',
    autoplay: onScroll({
      target: animateInStage.value!,
      enter: '-50% 0',
      leave: '-200% 0',
      sync: true,
    }),
  })

  // Section 2: Scroll for overview
  const mainStageInitialScroll = stageStore.getSection('mainStageInitialScroll')

  if (!mainStageInitialScroll) {
    console.error('MainStage: mainStageInitialScroll section is required')
    throw new Error('MainStage: mainStageInitialScroll section is required')
  }

  animate(scrollContainer.value!, {
    translateY: ['0', '100%'],
    easing: 'easeOutExpo',
    autoplay: onScroll({
      container: document.body,
      target: '#mainStageInitialScroll',
      enter: 'start top',
      leave: 'start end',
      sync: true,
      debug: true,
    }),
  })
})
</script>

<style scoped>
.overflow-scroll {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.overflow-scroll::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}
</style>
