<template>
  <div ref="main">
    <!-- Intro Section -->
    <IntroSection />

    <!-- Main Stage Section -->
    <MainStage />

    <!-- Scroll Prompt -->
    <ScrollPrompt />
  </div>
</template>

<script setup lang="ts">
import MainStage from './components/MainStage.vue'
import IntroSection from './components/IntroSection.vue'
import ScrollPrompt from './components/ScrollPrompt.vue'
</script>

<style scoped></style>
