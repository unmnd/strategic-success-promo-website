<template>
    <div class="flex flex-col gap-4 w-full">
        <div class="grid grid-cols-3 divide-x text-center gap-2">
            <div class="flex flex-col items-center justify-center">
                <div>Balance</div>
                <div class="text-3xl font-extrabold tracking-tight lg:text-5xl">
                    {{ formatter(bankStore.balance) }}
                </div>
            </div>

            <div class="grid grid-cols-3 items-center justify-center divide-x col-span-2">
                <div class="flex justify-center">
                    <RadioGroup v-model="view" class="flex flex-col gap-2">
                        <div class="flex items-center space-x-2">
                            <RadioGroupItem value="pl"> P&L </RadioGroupItem>
                            <Label for="pl"> P&L </Label>
                        </div>
                        <div class="flex items-center space-x-2">
                            <RadioGroupItem value="income"> Income </RadioGroupItem>
                            <Label for="income"> Income </Label>
                        </div>
                        <div class="flex items-center space-x-2">
                            <RadioGroupItem value="expenses"> Expenses </RadioGroupItem>
                            <Label for="expenses"> Expenses </Label>
                        </div>
                    </RadioGroup>
                </div>

                <div class="grid grid-cols-2 divide-x gap-2 col-span-2 h-full mt-0">
                    <div class="flex flex-col items-center justify-center h-full">
                        <div>Round {{ item.name }}</div>
                        <div
                            class="text-3xl font-extrabold tracking-tight"
                            :class="item.round.value < 0 ? 'text-red-500' : ''"
                        >
                            {{ formatter(item.round.value) }}
                        </div>
                    </div>

                    <div class="flex flex-col items-center justify-center h-full">
                        <div>Total {{ item.name }}</div>
                        <div
                            class="text-3xl font-extrabold tracking-tight"
                            :class="item.total.value < 0 ? 'text-red-500' : ''"
                        >
                            {{ formatter(item.total.value) }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <BankOverviewTransactions />
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useBankStore } from '../bank.store'
import { formatter } from '~/utils'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import { Label } from '~/components/ui/label'
import BankOverviewTransactions from './BankOverviewTransactions.vue'

const bankStore = useBankStore()
const view = ref<'pl' | 'income' | 'expenses'>('pl')

const data = {
    pl: {
        key: 'pl',
        name: 'Profit/Loss',
        round: computed(() => bankStore.stats.roundIncome + bankStore.stats.roundExpenses),
        total: computed(() => bankStore.stats.totalIncome + bankStore.stats.totalExpenses),
    },
    income: {
        key: 'income',
        name: 'Income',
        round: computed(() => bankStore.stats.roundIncome),
        total: computed(() => bankStore.stats.totalIncome),
    },
    expenses: {
        key: 'expenses',
        name: 'Expenses',
        round: computed(() => bankStore.stats.roundExpenses),
        total: computed(() => bankStore.stats.totalExpenses),
    },
}

const item = computed(() => data[view.value])
</script>
