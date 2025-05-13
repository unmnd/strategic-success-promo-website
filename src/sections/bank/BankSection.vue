<template>
    <div ref="container" class="w-screen min-h-screen flex flex-col items-center">
        <div class="pt-20 pb-8 max-w-3xl text-center" ref="text">
            <h1 class="text-2xl font-bold pb-4">
                <i class="ri-bank-fill"></i>
                Bank
            </h1>
            <div class="space-y-4">
                <p ref="p1">Track your spending. Plan for the unexpected.</p>

                <p ref="p2">
                    Teams learn to manage cash flow like a real business—balancing regular costs
                    such as upkeep, energy bills, and supplier payments, while staying prepared for
                    unexpected hits like equipment failures or market shifts.
                </p>

                <p ref="p3">
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
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fx } from '~/utils'
import { animate, onScroll } from 'animejs'
import BankOverview from './components/BankOverview.vue'
import { useIntersectionObserver } from '~/composables/useIntersectionObserver'

const { element: container } = useIntersectionObserver('bank')
const text = ref<HTMLElement | null>(null)
const p1 = ref<HTMLElement | null>(null)
const p2 = ref<HTMLElement | null>(null)
const p3 = ref<HTMLElement | null>(null)

onMounted(() => {
    // Animate text elements on scroll
    animate([text.value!, p1.value!, p2.value!, p3.value!], {
        ...fx.fadeUp,
        autoplay: onScroll({
            enter: '50% top',
            leave: '0 top',
            sync: 0.2,
        }),
    })
})
</script>

<style scoped></style>
