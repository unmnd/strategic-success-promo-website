import { defineStore } from 'pinia'
import { ref } from 'vue'
import { SECTIONS } from '~/config/stage.config'
import { useBackgroundStore } from './background'

export const useActiveSectionStore = defineStore('activeSection', () => {
    const activeSectionId = ref<string | null>(null)
    const backgroundStore = useBackgroundStore()

    function setActiveSection(sectionId: string | null) {
        activeSectionId.value = sectionId
        // Update background when section changes
        const section = SECTIONS.find((s) => s.id === sectionId)
        if (section) {
            backgroundStore.setBackground(section.background)
        }
    }

    return {
        activeSectionId,
        setActiveSection,
    }
})
