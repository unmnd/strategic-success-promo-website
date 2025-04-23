import { ref, computed, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { createTimeline } from 'animejs'

export interface Section {
  id: string
  element: Ref<HTMLElement | null>
}

export const useStageStore = defineStore('stage', () => {
  // Section management
  const sections: Section[] = [
    {
      id: 'intro',
      element: ref(null),
    },
    {
      id: 'animateInStage',
      element: ref(null),
    },
    {
      id: 'mainStageInitialScroll',
      element: ref(null),
    },
  ]

  function addSectionElement(id: string, element: HTMLElement) {
    const section = getSection(id)
    if (section) {
      section.element.value = element
    }
  }

  // Get a specific section
  const getSection = (id: string) => {
    return sections.find((s) => s.id === id)
  }

  return {
    sections,
    getSection,
    addSectionElement,
  }
})
