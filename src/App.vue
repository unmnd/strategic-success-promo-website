<template>
  <div ref="main" class="w-full h-full hidden lg:block">
    <!-- Global Background -->
    <Background />

    <!-- Scroll Prompt -->
    <ScrollPrompt />

    <!-- Sections -->
    <IntroSection />
    <InteractivityNote />
    <DecisionsSection />
    <SkillsSection />
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
import Background from './components/Background.vue'

import { useColorMode } from '@vueuse/core'
import SkillsSection from './sections/skills/SkillsSection.vue'

useColorMode()
</script>

<style scoped></style>
