<template>
  <div ref="el" class="border-pink-500 border">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useStageStore } from '../stores/stage'

const store = useStageStore()

const props = defineProps<{
  id: string
}>()

const el = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!el.value) {
    return
  }

  store.addSectionElement(props.id, el.value)
})
</script>

<style scoped></style>
