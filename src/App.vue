<template>
  <div ref="main">
    <!-- Intro Section -->
    <IntroSection ref="introSection" />

    <!-- Main Stage Section -->
    <MainStage ref="mainStage" />

    <GenericSection id="mainStageDecisions" class="h-[2000px]" />

    <!-- Outro Section -->
    <GenericSection id="outro" class="h-screen" />

    <!-- Debug Overlay -->
    <div v-if="true" class="debug-overlay">
      <div class="debug-header">
        <h3>Section Debug</h3>
        <button @click="showDebug = false">Close</button>
      </div>
      <div class="debug-content">
        <div v-for="id in sectionIDs" :key="id" class="section-status">
          <span class="section-id">{{ id }}</span>
          <span :class="['section-state', sectionStates[id] ? 'resolved' : 'pending']">
            {{ sectionStates[id] ? 'Resolved' : 'Pending' }}
          </span>
        </div>
      </div>
      <div class="debug-footer">
        <button @click="refreshSectionStates">Refresh</button>
      </div>
    </div>

    <!-- Debug Toggle Button -->
    <button class="debug-toggle" @click="showDebug = !showDebug">
      {{ showDebug ? 'Hide Debug' : 'Show Debug' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import MainStage from './components/MainStage.vue'
import IntroSection from './components/IntroSection.vue'
import { ref, onMounted, computed, watch, reactive } from 'vue'
import { useStageStore } from './stores/stage'
import { animate } from 'animejs'
import GenericSection from './components/GenericSection.vue'
import type { SectionID } from './stores/stage'

// Get section info for debugging
const stageStore = useStageStore()
const showDebug = ref(false)
const sectionIDs: SectionID[] = ['intro', 'animateInStage', 'mainStageInitialScroll']
const sectionStates = reactive<Record<SectionID, boolean>>({} as Record<SectionID, boolean>)

// Initialize section states
onMounted(() => {
  refreshSectionStates()
})

// Function to check section states
async function refreshSectionStates() {
  for (const id of sectionIDs) {
    try {
      // Use Promise.race with a timeout to check if the promise is resolved
      const resolved = await Promise.race([
        stageStore
          .getSection(id)
          .then(() => true)
          .catch(() => false),
        new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 0)),
      ])
      sectionStates[id] = resolved
    } catch {
      sectionStates[id] = false
    }
  }
}

// Periodically refresh section states when debug is visible
watch(showDebug, (isVisible) => {
  if (isVisible) {
    refreshSectionStates()
    const interval = setInterval(refreshSectionStates, 1000)
    watch(showDebug, (stillVisible) => {
      if (!stillVisible) {
        clearInterval(interval)
      }
    })
  }
})

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
// //       ease: 'easeOutQuad', // Smooth ease at the end
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
// //         ease: 'easeInQuad',
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

<style scoped>
.debug-overlay {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 15px;
  border-radius: 5px;
  width: 300px;
  z-index: 9999;
  font-family: monospace;
}

.debug-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  padding-bottom: 5px;
}

.debug-header h3 {
  margin: 0;
  font-size: 16px;
}

.debug-content {
  margin-bottom: 10px;
  max-height: 300px;
  overflow-y: auto;
}

.section-status {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  padding: 5px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.section-id {
  font-weight: bold;
}

.section-state {
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
}

.section-state.resolved {
  background-color: rgba(0, 255, 0, 0.3);
}

.section-state.pending {
  background-color: rgba(255, 165, 0, 0.3);
}

.debug-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  z-index: 9998;
  font-size: 12px;
}

.debug-toggle:hover {
  background-color: rgba(0, 0, 0, 0.9);
}

button {
  background-color: rgba(50, 50, 50, 0.8);
  border: none;
  color: white;
  padding: 4px 8px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
}

button:hover {
  background-color: rgba(70, 70, 70, 0.8);
}
</style>
