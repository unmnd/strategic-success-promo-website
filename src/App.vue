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
        <DecisionsSection ref="decisionsSection" />
        <SkillsSection ref="skillsSection" />
        <MarketSection ref="marketSection" />
        <WarehouseSection ref="warehouseSection" />
        <BankSection ref="bankSection" />

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
import { ref, provide } from 'vue'

import { Toaster } from './components/ui/sonner'
import IntroSection from './sections/intro/IntroSection.vue'
import InteractivityNote from './sections/intro/InteractivityNote.vue'
import DecisionsSection from './sections/decisions/DecisionsSection.vue'
import SkillsSection from './sections/skills/SkillsSection.vue'
import MarketSection from './sections/market/MarketSection.vue'
import WarehouseSection from './sections/warehouse/WarehouseSection.vue'
import BankSection from './sections/bank/BankSection.vue'
import ProgressTimeline from './components/ProgressTimeline.vue'

const introSection = ref<InstanceType<typeof IntroSection> | null>(null)
const interactivitySection = ref<InstanceType<typeof InteractivityNote> | null>(null)
const decisionsSection = ref<InstanceType<typeof DecisionsSection> | null>(null)
const skillsSection = ref<InstanceType<typeof SkillsSection> | null>(null)
const marketSection = ref<InstanceType<typeof MarketSection> | null>(null)
const warehouseSection = ref<InstanceType<typeof WarehouseSection> | null>(null)
const bankSection = ref<InstanceType<typeof BankSection> | null>(null)

const sectionRefs = {
    intro: introSection,
    interactivity: interactivitySection,
    decisions: decisionsSection,
    skills: skillsSection,
    market: marketSection,
    warehouse: warehouseSection,
    bank: bankSection,
}

// Function to scroll to a section
const scrollToSection = (sectionId: string) => {
    const section = sectionRefs[sectionId as keyof typeof sectionRefs]
    if (section?.value?.$el) {
        section.value.$el.scrollIntoView({ behavior: 'smooth' })
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
