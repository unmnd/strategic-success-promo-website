import { ref, computed, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { createTimeline } from 'animejs'

// Define strict section ID types
export type SectionID = 'intro' | 'mainStageAnimateIn' | 'mainStageDecisions' | 'outro'

export interface Section {
  element: Promise<HTMLElement>
  resolve: (element: HTMLElement) => void
}

export const useStageStore = defineStore('stage', () => {
  const WIDTH = 1200
  const HEIGHT = 720

  // Section management
  const sections = new Map<SectionID, Section>()

  // Create a section if it doesn't exist yet
  function _ensureSection(id: SectionID): Section {
    if (!sections.has(id)) {
      let resolveFunction!: (element: HTMLElement) => void
      const promise = new Promise<HTMLElement>((resolve) => {
        resolveFunction = resolve
      })

      sections.set(id, {
        element: promise,
        resolve: resolveFunction,
      })
    }

    return sections.get(id)!
  }

  function addSectionElement(id: SectionID, element: HTMLElement) {
    const section = _ensureSection(id)
    section.resolve(element)
  }

  // Get a specific section's element promise
  function getSection(id: SectionID): Promise<HTMLElement> {
    return _ensureSection(id).element
  }

  const cursorType = ref<'default' | 'handpointing'>('default')
  const cursorPosition = ref({ x: WIDTH / 2, y: HEIGHT + 100 })
  const cursorClick = ref(false)

  return {
    WIDTH,
    HEIGHT,
    getSection,
    addSectionElement,
    cursorType,
    cursorPosition,
    cursorClick,
  }
})
