<template>
  <div ref="container" class="absolute inset-0 flex items-center justify-center opacity-0">
    <div class="text-muted-foreground text-sm">
      <i class="ri-information-line"></i>

      <p class="mt-2">All game elements are interactive.</p>
      <p>Play around with them to get a feel for the game.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useStageStore } from '~/stores/stage'
import { fx } from '~/utils'

const store = useStageStore()

const container = ref<HTMLElement | null>(null)

onMounted(() => {
  // Create a checkpoint at the beginning
  store.createCheckpoint('intro')

  store.timeline.add(container.value!, fx.fadeIn)

  store.timeline.call(() => {
    store.pauseTimeline()
  }, '+=0')

  store.timeline.add(container.value!, fx.fadeOut)
})
</script>

<style scoped></style>
