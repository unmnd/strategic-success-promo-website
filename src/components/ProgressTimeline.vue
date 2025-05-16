<template>
    <div
        ref="container"
        class="flex flex-col gap-4 py-4 h-screen w-full select-none text-sm relative"
        :style="{ transform: `translateX(${xTranslation}%)` }"
    >
        <div
            v-for="section in filteredSections"
            :key="section"
            :ref="(el) => setSectionRef(el as HTMLElement | null, section)"
            class="transition uppercase text-end pr-2 [writing-mode:vertical-lr] unica-one-regular pl-2 hover:opacity-100 hover:translate-x-[0.25rem]"
            :class="{
                'opacity-20': section !== activeSectionStore.activeSectionId,
                'opacity-100 border-r font-bold': section === activeSectionStore.activeSectionId,
            }"
            @click="handleSectionClick(section)"
        >
            {{ section }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { MAIN_SECTION_IDS } from '~/config/stage.config'
import { useActiveSectionStore } from '~/stores/activeSection'
import { onMounted, ref, watch, inject } from 'vue'
import { animate } from 'animejs'

const container = ref<HTMLElement | null>(null)
const xTranslation = ref(-100)

const activeSectionStore = useActiveSectionStore()
const sectionRefs = ref<Record<string, HTMLElement | null>>({})

interface AppInstance {
    scrollToSection: (sectionId: string) => void
}

const app = inject<AppInstance>('app')

const filteredSections = MAIN_SECTION_IDS

const setSectionRef = (el: HTMLElement | null, id: string) => {
    sectionRefs.value[id] = el
}

const handleSectionClick = (section: string) => {
    // First set the active section
    activeSectionStore.setActiveSection(section)
    // Then scroll to the section
    if (app?.scrollToSection) {
        app.scrollToSection(section)
    }
}

onMounted(() => {
    // Store original positions when mounted
    const originalPositions = ref<Record<string, number>>({})

    // Calculate and store original positions
    const calculateOriginalPositions = () => {
        const sections = Object.entries(sectionRefs.value)
        let currentPosition = 0

        sections.forEach(([id, el]) => {
            if (el) {
                originalPositions.value[id] = currentPosition
                currentPosition += el.offsetHeight + 16 // 16px for gap
            }
        })
    }

    // Calculate positions after a short delay to ensure all elements are rendered
    setTimeout(calculateOriginalPositions, 100)

    watch(
        () => activeSectionStore.activeSectionId,
        (newId) => {
            if (!container.value || !newId) return

            // Animate x translation
            if (newId === 'intro') {
                animate(container.value, {
                    translateX: -100,
                    ease: 'inExpo',
                    duration: 500,
                })
            } else {
                animate(container.value, {
                    translateX: 0,
                    ease: 'outExpo',
                    duration: 2000,
                })
            }

            const containerHeight = container.value.offsetHeight
            const activeSectionEl = sectionRefs.value[newId]

            // if (activeSectionEl) {
            // Use the stored original position
            const originalPosition = originalPositions.value[newId] || 0
            const sectionHeight = activeSectionEl?.offsetHeight || 0

            // Calculate target scroll position
            const targetScroll = originalPosition - containerHeight / 2 + sectionHeight / 2

            // Animate the container to center the active section
            animate(container.value, {
                translateY: -targetScroll,
                ease: 'outExpo',
                duration: 1000,
            })

            // Animate the active section
            Object.entries(sectionRefs.value).forEach(([id, el]) => {
                if (el) {
                    animate(el, {
                        paddingBottom: id === newId ? '8rem' : '0',
                        ease: 'outExpo',
                        duration: 800,
                    })
                }
            })
        },
    )
})
</script>

<style scoped>
.container {
    position: relative;
    transition: transform 0.3s ease;
}
</style>
