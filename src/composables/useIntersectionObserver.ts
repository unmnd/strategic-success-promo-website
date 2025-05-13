import { onMounted, onUnmounted, ref } from 'vue'
import { useActiveSectionStore } from '~/stores/activeSection'

export function useIntersectionObserver(sectionId: string) {
    const element = ref<HTMLElement | null>(null)
    const activeSectionStore = useActiveSectionStore()
    let observer: IntersectionObserver | null = null

    onMounted(() => {
        observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        activeSectionStore.setActiveSection(sectionId)
                    }
                })
            },
            {
                threshold: 0.5, // Trigger when 50% of the section is visible
            },
        )

        if (element.value) {
            observer.observe(element.value)
        }
    })

    onUnmounted(() => {
        if (observer) {
            observer.disconnect()
        }
    })

    return {
        element,
    }
}
