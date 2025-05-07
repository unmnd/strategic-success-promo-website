<template>
  <div ref="main" class="w-full h-full hidden lg:block">
    <!-- Intro Section -->
    <IntroSection />

    <InteractivityNote />

    <!-- Main Stage Section -->
    <!-- <MainStage /> -->

    <DecisionsSection />

    <!-- Scroll Prompt -->
    <ScrollPrompt />
  </div>

  <div class="lg:hidden">
    <div class="flex flex-col items-center justify-center h-screen">
      <i class="ri-error-warning-line"></i>
      This site is best viewed on a desktop.
    </div>
  </div>
</template>

<script setup lang="ts">
import IntroSection from './sections/intro/IntroSection.vue'
import ScrollPrompt from './components/ScrollPrompt.vue'
import DecisionsSection from './sections/decisions/DecisionsSection.vue'
import InteractivityNote from './sections/intro/InteractivityNote.vue'

import { useColorMode } from '@vueuse/core'

useColorMode()
</script>

<style scoped></style>
