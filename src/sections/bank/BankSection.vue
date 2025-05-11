<template>
    <div ref="container" class="inset-0 absolute px-8 overflow-y-scroll">
        <div class="relative w-full flex flex-col items-center">
            <div class="pt-20 pb-8 max-w-3xl text-center opacity-0" ref="text">
                <h1 class="text-2xl font-bold pb-4">
                    <i class="ri-bank-fill"></i>
                    Bank
                </h1>
                <div class="space-y-4">
                    <p ref="p1" class="opacity-0">Track your spending. Plan for the unexpected.</p>

                    <p ref="p2" class="opacity-0">
                        Teams learn to manage cash flow like a real business—balancing regular costs
                        such as upkeep, energy bills, and supplier payments, while staying prepared
                        for unexpected hits like equipment failures or market shifts.
                    </p>

                    <p ref="p3" class="opacity-0">
                        Smart financial management can be the difference between steady growth and
                        sudden collapse.
                    </p>
                </div>
            </div>

            <div
                ref="bank"
                class="w-full max-w-6xl flex items-center justify-center p-4 mb-8 bg-card rounded-xl border"
            >
                <BankOverview />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fx } from '~/utils'
import { createTimeline, stagger } from 'animejs'

import BankOverview from './components/BankOverview.vue'

const text = ref<HTMLElement | null>(null)
const p1 = ref<HTMLElement | null>(null)
const p2 = ref<HTMLElement | null>(null)
const p3 = ref<HTMLElement | null>(null)

onMounted(() => {
    // Setup timeline
    createTimeline().add(
        [text.value!, p1.value!, p2.value!, p3.value!],
        {
            ...fx.fadeUp,
            delay: stagger(500),
        },
        '+=500',
    )
})
</script>
