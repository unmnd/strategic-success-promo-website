<template>
  <div ref="main" class="w-screen h-screen overflow-hidden hidden lg:block">
    <Toaster />

    <!-- Global Background -->
    <Background />

    <!-- Scroll Prompt -->
    <!-- <ScrollPrompt /> -->

    <!-- Router View for Sections -->
    <router-view v-slot="{ Component, route }">
      <Transition @enter="handleEnter" @leave="handleLeave" mode="out-in" :css="false">
        <component :is="Component" :key="route.path" />
      </Transition>
    </router-view>

    <!-- Debug button to change sections -->
    <Button class="fixed bottom-4 right-4" @click="goToPreviousSection">Previous Section</Button>
    <Button class="fixed bottom-4 right-4" @click="goToNextSection">Next Section</Button>
  </div>

  <div class="lg:hidden">
    <div class="flex flex-col items-center justify-center h-screen">
      <i class="ri-error-warning-line"></i>
      This site is best viewed on a desktop.
    </div>
  </div>
</template>

<script setup lang="ts">
// import ScrollPrompt from './components/ScrollPrompt.vue'
import Background from './components/Background.vue'
import { useColorMode } from '@vueuse/core'
import { goToNextSection, goToPreviousSection } from './router'
import { Button } from './components/ui/button'
import { animate } from 'animejs'
import { fx } from './utils'
import { Toaster } from './components/ui/sonner'

useColorMode()

function handleEnter(el: Element, done: () => void) {
  animate(el, { ...fx.fadeUp, onComplete: done })
}

function handleLeave(el: Element, done: () => void) {
  animate(el, { ...fx.fadeUpOut, onComplete: done })
}
</script>

<style scoped></style>
