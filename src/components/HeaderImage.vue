<template>
  <div class="relative">
    <ImageNatural>
      <img src="../assets/screenshots/header_active.png" />
    </ImageNatural>

    <div class="absolute w-full h-2 top-2 mt-px px-2">
      <div class="w-full h-full border border-zinc-800 rounded-full bg-zinc-950">
        <div
          class="h-full bg-white rounded-full"
          :style="{ width: roundProgress * 100 + '%' }"
        ></div>
      </div>
    </div>

    <div class="absolute text-white text-xl font-extrabold right-[288px] top-[93px] bg-zinc-950">
      {{ formattedTime }}
    </div>
  </div>
</template>

<script setup lang="ts">
import ImageNatural from './ImageNatural.vue'
import { useStageStore } from '../stores/stage'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const stateStore = useStageStore()
const { roundProgress } = storeToRefs(stateStore)

const totalSeconds = computed(() => Math.floor((1 - roundProgress.value) * 420)) // 7 minutes = 420 seconds
const formattedTime = computed(() => {
  if (totalSeconds.value < 0) return '00:00'

  const seconds = totalSeconds.value
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
})
</script>

<style scoped></style>
