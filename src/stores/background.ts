import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBackgroundStore = defineStore('background', () => {
  const currentBackground = ref<string | null>(null)

  function setBackground(source: string | null) {
    currentBackground.value = source
  }

  return {
    currentBackground,
    setBackground,
  }
})
