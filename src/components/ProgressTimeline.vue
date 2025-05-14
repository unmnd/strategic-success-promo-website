<template>
    <div
        ref="container"
        class="-translate-x-[100%] h-screen w-full flex flex-col gap-4 justify-center select-none"
    >
        <div
            v-for="section in filteredSections"
            :key="section"
            :ref="(el) => setSectionRef(el as HTMLElement | null, section)"
            class="transition uppercase text-end pr-2 [writing-mode:vertical-lr] hover:opacity-100 hover:translate-x-0 -translate-x-2 pl-2"
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
import { SECTIONS } from '~/config/stage.config'
import { useActiveSectionStore } from '~/stores/activeSection'
import { onMounted, ref, watch, inject } from 'vue'
import { animate, createAnimatable } from 'animejs'

const container = ref<HTMLElement | null>(null)

const activeSectionStore = useActiveSectionStore()
const sectionRefs = ref<Record<string, HTMLElement | null>>({})

interface AppInstance {
    scrollToSection: (sectionId: string) => void
}

const app = inject<AppInstance>('app')

const filteredSections = SECTIONS.map((el) => el.id).filter(
    (el) => !['intro', 'interactivity'].includes(el),
)

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
    const animatables = Object.entries(sectionRefs.value).reduce(
        (acc, [id, el]) => {
            if (el) {
                acc[id] = createAnimatable(el, {
                    height: '64px',
                    ease: 'outExpo',
                    duration: 800,
                })
            }
            return acc
        },
        {} as Record<string, ReturnType<typeof createAnimatable>>,
    )

    watch(
        () => activeSectionStore.activeSectionId,
        (newId) => {
            // If the sectionID is anything but intro, animate the container in
            animate(
                container.value!,
                newId === 'intro'
                    ? {
                          translateX: ['-100%'],
                          opacity: 0,
                          ease: 'inExpo',
                          duration: 1000,
                      }
                    : {
                          translateX: ['100%'],
                          opacity: 1,
                          ease: 'outExpo',
                          duration: 2000,
                      },
            )

            if (newId) {
                Object.entries(animatables).forEach(([id, animatable]) => {
                    if (id === newId) {
                        animatable.height(320)
                    } else {
                        animatable.height(64)
                    }
                })
            }
        },
    )
})
</script>

<style scoped></style>
