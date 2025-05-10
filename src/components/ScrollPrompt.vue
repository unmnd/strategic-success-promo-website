<template>
    <div
        class="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1 opacity-0 scale-90 transition-all duration-300"
        :class="{ 'opacity-100 scale-100': showPrompt }"
    >
        <p class="text-zinc-500 text-sm font-medium">scroll</p>
        <div class="animate-bounce">
            <div class="w-3 h-3 border-r border-b border-zinc-500 rotate-45"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useStageStore } from '../stores/stage'

const store = useStageStore()
const showPrompt = ref(false)
const initialShowPrompt = ref(true)
let pauseTimer: number | null = null

watch(
    () => store.isPaused,
    (isPaused) => {
        if (isPaused) {
            pauseTimer = window.setTimeout(
                () => {
                    showPrompt.value = true
                    initialShowPrompt.value = false
                },
                initialShowPrompt.value ? 1000 : 3000,
            )
        } else {
            if (pauseTimer) {
                clearTimeout(pauseTimer)
                pauseTimer = null
            }
            showPrompt.value = false
        }
    },
)
</script>

<style scoped></style>
