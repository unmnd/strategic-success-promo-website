<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '~/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <h3 data-slot="card-title" :class="cn('leading-none text-2xl font-semibold', props.class)">
    <slot />
  </h3>
</template>
