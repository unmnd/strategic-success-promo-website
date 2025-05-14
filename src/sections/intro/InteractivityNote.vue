<template>
    <div ref="container" class="w-full h-screen flex items-center justify-center">
        <div class="text-muted-foreground text-sm">
            <i class="ri-information-line"></i>

            <p class="mt-2">All game elements are interactive.</p>
            <p>Play around with them to get a feel for the game.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { animate, onScroll } from 'animejs'
import { onMounted, ref } from 'vue'
import { fx } from '~/utils'

const container = ref<HTMLElement | null>(null)

onMounted(() => {
    animate(container.value!, {
        ...fx.fadeIn,
        autoplay: onScroll({
            enter: '50% top',
            leave: '0 top',
            sync: 0.2,
        }),
    })
})
</script>

<style scoped></style>
