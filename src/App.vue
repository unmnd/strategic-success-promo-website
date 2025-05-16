<template>
    <div ref="main" class="hidden lg:block pl-12">
        <Toaster />

        <!-- Global Background -->
        <Background />

        <div class="fixed w-12 left-0">
            <ProgressTimeline />
        </div>

        <IntroSection ref="introSection" class="pr-12" />
        <InteractivityNote ref="interactivitySection" class="pr-12" />

        <div
            v-for="(section, key) in sections"
            :key="key"
            :ref="(el) => setSectionRef(key, el)"
            class="mb-64 overflow-hidden"
        >
            <component :is="section.component" />
        </div>

        <!-- Scroll Prompt -->
        <!-- <ScrollPrompt /> -->

        <!-- Router View for Sections -->
        <!-- <router-view v-slot="{ Component, route }">
            <Transition @enter="handleEnter" @leave="handleLeave" mode="out-in" :css="false">
                <component :is="Component" :key="route.path" />
            </Transition>
        </router-view> -->
    </div>

    <div class="lg:hidden">
        <div class="flex flex-col items-center justify-center h-screen">
            <i class="ri-error-warning-line"></i>
            This site is best viewed on a desktop.
        </div>
    </div>
</template>

<script setup lang="ts">
// import ScrollPrompt from './components/ScrollPrompt.vue'
import Background from './components/Background.vue'
import { useColorMode } from '@vueuse/core'
import { ref, provide, reactive, type Component } from 'vue'
import { defineAsyncComponent } from 'vue'

import { Toaster } from './components/ui/sonner'
import IntroSection from './sections/intro/IntroSection.vue'
import InteractivityNote from './sections/intro/InteractivityNote.vue'
import ProgressTimeline from './components/ProgressTimeline.vue'
import { MAIN_SECTIONS } from './config/stage.config'

const introSection = ref<InstanceType<typeof IntroSection> | null>(null)
const interactivitySection = ref<InstanceType<typeof InteractivityNote> | null>(null)

const sections = reactive(
    MAIN_SECTIONS.reduce(
        (acc, section) => {
            acc[section.id] = {
                component: defineAsyncComponent(section.component),
            }
            return acc
        },
        {} as Record<string, { component: Component }>,
    ),
)

const sectionRefs = reactive({
    intro: introSection,
    interactivity: interactivitySection,
    ...MAIN_SECTIONS.reduce(
        (acc, section) => {
            acc[section.id] = ref(null)
            return acc
        },
        {} as Record<string, Component>,
    ),
})

const setSectionRef = (
    key: string,
    el: any, // eslint-disable-line @typescript-eslint/no-explicit-any
) => {
    if (el) {
        sectionRefs[key as keyof typeof sectionRefs] = el
    }
}

// Function to scroll to a section
const scrollToSection = (sectionId: string) => {
    const section = sectionRefs[sectionId as keyof typeof sectionRefs] as HTMLElement | null

    if (section) {
        section.scrollIntoView({ behavior: 'smooth' })
    } else {
        console.error(`Section not found: ${sectionId}`)
    }
}

// Expose the scroll function to be used by other components
defineExpose({
    scrollToSection,
})

// Provide the app instance to child components
provide('app', {
    scrollToSection,
})

useColorMode()
</script>

<style scoped></style>
