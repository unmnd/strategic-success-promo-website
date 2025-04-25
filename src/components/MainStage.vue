<template>
  <GenericSection id="mainStageAnimateIn" class="h-screen">
    <div ref="scrollTracker"></div>
  </GenericSection>

  <div class="fixed top-0 h-screen w-screen flex items-center justify-center" ref="container">
    <!--TODO: pointer-events-none & remove mousemove -->
    <div
      class="relative shrink-0 bg-zinc-950 text-foreground border border-zinc-800 rounded-2xl select-none overflow-clip"
      :style="{
        width: `${store.WIDTH}px`,
        height: `${store.HEIGHT}px`,
      }"
      @mousemove="trackMousePosition"
      ref="stage"
    >
      <div ref="scrollContainer">
        <div class="flex flex-col mx-auto gap-4 p-8">
          <img src="../assets/screenshots/title.png" />

          <HeaderImage />

          <ImageNatural v-if="!decisionSelected">
            <img src="../assets/screenshots/decisions_1.png" />
          </ImageNatural>

          <ImageNatural v-if="decisionSelected">
            <img src="../assets/screenshots/decisions_3.png" />
          </ImageNatural>

          <div
            ref="decisions2"
            class="absolute w-[120%] h-[120%] -left-[10%] -top-[10%] flex items-center justify-center bg-zinc-950/80 opacity-0 scale-90"
          >
            <ImageNatural class="rounded-lg overflow-clip">
              <img src="../assets/screenshots/decisions_2.png" />
            </ImageNatural>
          </div>
        </div>
      </div>

      <Cursor />

      <!-- Debug Overlay -->
      <div
        v-if="showDebugOverlay"
        class="absolute top-2 left-2 bg-black/80 text-white px-3 py-1 rounded text-sm pointer-events-auto z-50"
      >
        X: {{ mouseX }} Y: {{ mouseY }}
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
import { animate, onScroll, createTimeline } from 'animejs'
import Cursor from './Cursor.vue'

const container = ref<HTMLElement | null>(null)
const scrollContainer = ref<HTMLElement | null>(null)
const stage = ref<HTMLElement | null>(null)

const decisions2 = ref<HTMLElement | null>(null)
const decisionSelected = ref(false)

// Debug overlay state
const showDebugOverlay = ref(true)
const mouseX = ref(0)
const mouseY = ref(0)

const trackMousePosition = (event: MouseEvent) => {
  console.log('trackMousePosition', event)
  if (stage.value) {
    const rect = stage.value.getBoundingClientRect()
    mouseX.value = Math.round(event.clientX - rect.left)
    mouseY.value = Math.round(event.clientY - rect.top)
  }
}

const store = useStageStore()

// Animate appearance of the stage at section
onMounted(async () => {
  const tl = createTimeline()

  // Add window scroll down listener to play the timeline
  window.addEventListener('scroll', () => {
    tl.resume()
  })

  const mainStageAnimateIn = await store.getSection('mainStageAnimateIn')

  // Section 1: Animate in the stage
  tl.add(container.value!, {
    translateY: ['100vh', '0'],
    ease: 'outExpo',
    // autoplay: onScroll({
    //   target: mainStageAnimateIn,
    //   enter: 'start -50%',
    //   leave: 'start end',
    //   sync: true,
    // }),
  })

  //   // Section 2: Scroll for overview
  //   const mainStageInitialScroll = await store.getSection('mainStageDecisions')
  //
  //   animate(scrollContainer.value!, {
  //     autoplay: onScroll({
  //       target: mainStageInitialScroll,
  //       enter: 'start 0%',
  //     }),
  //     onBegin: () => {
  // Create a timeline to sequence the animations
  // const tl = createTimeline({ defaults: { duration: 500 }, loop: true, loopDelay: 5000 })

  // // Label the start of our timeline
  // tl.label('start')

  tl.call(() => {
    // Ensure decision is not selected
    decisionSelected.value = false

    // Pause until scroll down
    tl.pause()
  }, '+=0')

  // Animate cursor to initial position
  tl.call(() => {
    store.cursorPosition.x = 1100
    store.cursorPosition.y = 390
  }, '+=10')

  // Set cursor type to pointing hand
  tl.call(() => {
    store.cursorType = 'handpointing'
  }, '+=500')

  tl.call(() => {
    tl.pause()
  }, '+=1000')

  // Add cursor click after the cursor changes
  tl.call(() => {
    store.cursorClick = true
  }, '+=10')

  tl.call(() => {
    store.cursorType = 'default'
  }, '+=100')

  // Show decisions2 element with animation
  tl.add(
    decisions2.value!,
    {
      opacity: [0, 1],
      scale: [0.9, 1],
      duration: 1000,
      ease: 'outExpo',
    },
    '+=0',
  )

  // Pause the timeline
  tl.call(() => {
    tl.pause()
  }, '+=0')

  tl.call(() => {
    store.cursorPosition.x = 784
    store.cursorPosition.y = 520
  }, '+=10')

  // Set cursor type to pointing hand
  tl.call(() => {
    store.cursorType = 'handpointing'
  }, '+=500')

  // Add cursor click after the cursor changes
  tl.call(() => {
    store.cursorClick = true
  }, '+=1000')

  tl.call(() => {
    store.cursorType = 'default'
  }, '+=100')

  // Instant hide decisions1 and replace with decisions3
  tl.call(() => {
    decisionSelected.value = true
  }, '+=0')

  // Animate decisions2 out
  // Show decisions2 element with animation
  tl.add(
    decisions2.value!,
    {
      opacity: [1, 0],
      scale: [1, 0.9],
      duration: 1000,
      ease: 'outExpo',
    },
    '+=0',
  )
  //   },
  // })
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
