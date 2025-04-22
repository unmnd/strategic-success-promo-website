import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useStageStore = defineStore('stage', () => {
  const height = ref(8000)

  const _scroll = ref(0)
  const scroll = computed(() => {
    return _scroll.value / (height.value - window.innerHeight)
  })

  const setScroll = (value: number) => {
    _scroll.value = value
  }

  const roundProgress = computed(() => {
    return scroll.value
  })

  return { roundProgress, scroll, setScroll }
})
