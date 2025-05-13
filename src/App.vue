<template>
    <div ref="main" class="hidden lg:block">
        <Toaster />

        <!-- Global Background -->
        <Background />

        <IntroSection />
        <InteractivityNote />
        <DecisionsSection />
        <SkillsSection />
        <MarketSection />
        <WarehouseSection />
        <BankSection />

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

import { Toaster } from './components/ui/sonner'
import IntroSection from './sections/intro/IntroSection.vue'
import InteractivityNote from './sections/intro/InteractivityNote.vue'
import DecisionsSection from './sections/decisions/DecisionsSection.vue'
import SkillsSection from './sections/skills/SkillsSection.vue'
import MarketSection from './sections/market/MarketSection.vue'
import WarehouseSection from './sections/warehouse/WarehouseSection.vue'
import BankSection from './sections/bank/BankSection.vue'

useColorMode()
</script>

<style scoped></style>
