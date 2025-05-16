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
                // Use rootMargin to create a trigger boundary at 50% of viewport height
                // Negative top margin means we're pushing the boundary up from the bottom of viewport
                rootMargin: '-50% 0px 0px 0px',
                threshold: 0, // Trigger as soon as any part enters this boundary
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
