<template>
  <div ref="main" class="h-[8000px]">
    <div class="sticky top-0 h-[100vh] flex items-center justify-center">
      <MainStage />
    </div>

    {{ stateStore.scroll }}
  </div>
</template>

<script setup lang="ts">
import MainStage from './components/MainStage.vue'
import { ref } from 'vue'
import { useStageStore } from './stores/stage'

const main = ref<HTMLElement | null>(null)

const stateStore = useStageStore()

window.onscroll = () => {
  stateStore.setScroll(window.scrollY)
}
</script>

<style scoped></style>
