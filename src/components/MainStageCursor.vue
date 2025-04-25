<template>
  <span class="absolute pointer-events-none" ref="animatableElement">
    <img v-if="store.cursorType === 'default'" src="../assets/cursor/default.svg" />
    <img v-if="store.cursorType === 'handpointing'" src="../assets/cursor/handpointing.svg" />
  </span>
</template>

<script setup lang="ts">
import { createAnimatable } from 'animejs'
import { useStageStore } from '../stores/stage'
import { onMounted, ref, watch } from 'vue'

const store = useStageStore()

const animatableElement = ref<HTMLElement | null>(null)

onMounted(() => {
  const animatable = createAnimatable(animatableElement.value!, {
    ease: 'outExpo',
    left: 1000,
    top: 1000,
    scale: 200,
  })

  watch(
    store.cursorPosition,
    () => {
      animatable.left(store.cursorPosition.x)
      animatable.top(store.cursorPosition.y)
    },
    {
      immediate: true,
      deep: true,
    },
  )

  watch(
    () => store.cursorClick,
    () => {
      animatable.scale(store.cursorClick ? 0.9 : 1)
      setTimeout(() => {
        store.cursorClick = false
      }, 200)
    },
    { immediate: true },
  )
})
</script>

<style scoped></style>
