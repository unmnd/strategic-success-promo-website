<template>
    <!-- :stroke="colourMode === 'dark' ? '#262626' : '#e5e5e5'" -->
    <line
        :x1="link.source.x"
        :y1="link.source.y"
        :x2="link.target.x"
        :y2="link.target.y"
        stroke="var(--local-border)"
        stroke-width="1.5"
    />
</template>

<script setup lang="ts">
import type { Link } from '../effect.interface'

defineProps<{
    link: Link
}>()
</script>

<style scoped>
* {
    --local-border: hsl(var(--border));
}
</style>
