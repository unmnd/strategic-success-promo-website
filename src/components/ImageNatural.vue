<template>
  <div ref="container" class="relative">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    scale?: number
  }>(),
  {
    scale: 2,
  },
)

const container = ref<HTMLDivElement | null>(null)

onMounted(() => {
  if (!container.value) {
    throw new Error('Could not find container element')
  }

  const img = container.value.querySelector('img')

  if (!img) {
    throw new Error('Could not find img element')
  }

  // Set image to natural width and height
  img.style.width = `${img.naturalWidth / props.scale}px`
  img.style.height = `${img.naturalHeight / props.scale}px`
})
</script>

<style scoped></style>
