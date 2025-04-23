<template>
  <div ref="main">
    <!-- Intro Section -->
    <IntroSection ref="introSection" />

    <!-- Main Stage Section -->
    <MainStage ref="mainStage" />

    <GenericSection id="mainStageInitialScroll" class="h-[300vh] bg-green-300" />
  </div>
</template>

<script setup lang="ts">
import MainStage from './components/MainStage.vue'
import IntroSection from './components/IntroSection.vue'
import { ref, onMounted, computed, watch } from 'vue'
import { useStageStore } from './stores/stage'
import { animate } from 'animejs'
import GenericSection from './components/GenericSection.vue'

const main = ref<HTMLElement | null>(null)
const mainStage = ref<InstanceType<typeof MainStage> | null>(null)
const stageContainer = ref<HTMLElement | null>(null)
const introSection = ref<InstanceType<typeof IntroSection> | null>(null)
const introContainer = ref<HTMLElement | null>(null)

const stageStore = useStageStore()

// Get section info for debugging

// // Define our sections
// onMounted(() => {
//   setupSections()
//
//   // Listen for resize to update section heights
//   window.addEventListener('resize', setupSections)

// Set up animations
// setupAnimations()
// })
//
// const setupSections = () => {
//   // We need to make each section take one "screen" worth of scrolling.
//   // Since we need to account for the viewport height, each section should be viewport height
//   const viewportHeight = window.innerHeight
//
//   // Using section heights equal to viewport height ensures each section takes
//   // exactly one "screen" of scrolling to get through
//   stageStore.updateSection('intro', viewportHeight)
//   stageStore.updateSection('main', viewportHeight)
//
//   // For debugging
//   console.log('Sections set up with viewport height:', viewportHeight)
//   console.log('Total height:', stageStore.totalHeight)
//   console.log('Intro section:', stageStore.getSectionInfo('intro'))
//   console.log('Main section:', stageStore.getSectionInfo('main'))
// }
//
// // const setupAnimations = () => {
// //   // Set up intro animations
// //   if (introSection.value) {
// //     // Trigger intro section animations
// //     introSection.value.setupAnimations(
// //       stageStore.timeline.addScrollLinked,
// //       stageStore.timeline.addScrollTriggered,
// //     )
// //   }
// //
// //   // Set up main stage animations
// //   if (mainStage.value && stageContainer.value) {
// //     // Initial animation - MainStage starts half off the bottom of the screen
// //     // and animates into position as we scroll from section 0 to section 1
// //     stageStore.timeline.addScrollLinked({
// //       targets: mainStage.value.$el,
// //       sectionId: 'main',
// //       properties: {
// //         translateY: [window.innerHeight / 2, 0], // Start half off screen, end at current position
// //         opacity: [0, 1], // Fade in
// //       },
// //       easing: 'easeOutQuad', // Smooth easing at the end
// //     })
// //
// //     // Also make the intro section fade out as we scroll into the main section
// //     if (introContainer.value) {
// //       stageStore.timeline.addScrollLinked({
// //         targets: introContainer.value,
// //         sectionId: 'main',
// //         properties: {
// //           opacity: [1, 0],
// //         },
// //         easing: 'easeInQuad',
// //         offset: 0, // Start at beginning of main section
// //       })
// //     }
// //   }
// // }
//
// // Update scroll position when window scrolls
// window.onscroll = () => {
//   stageStore.setScroll(window.scrollY)
// }
//
// // For debug display
// const currentSection = computed(() => {
//   const sections = stageStore.sections
//   for (const section of sections) {
//     if (section.startPosition === undefined) continue
//
//     const start = section.startPosition
//     const end = start + section.height
//
//     if (stageStore.rawScroll >= start && stageStore.rawScroll < end) {
//       return section.id
//     }
//   }
//   return 'unknown'
// })
//
// const sectionProgress = computed(() => {
//   return stageStore.getSectionProgress(currentSection.value)
// })
</script>

<style scoped></style>
