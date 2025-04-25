<template>
  <div ref="el" class="border-pink-500 border">
    {{ props.id }}
    <slot />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useStageStore, type SectionID } from '../stores/stage'

const store = useStageStore()

const props = defineProps<{
  id: SectionID
}>()

const el = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!el.value) {
    throw new Error('GenericSection: el is required')
  }

  store.addSectionElement(props.id, el.value)
})
</script>

<style scoped></style>
