<template>
    <NumberField
        id="amount"
        :default-value="0"
        :min="0.0"
        :step="0.01"
        :format-options="{
            style: 'currency',
            currency: 'GBP',
            currencyDisplay: 'symbol',
            currencySign: 'standard',
        }"
        v-model="amount"
    >
        <Label for="amount">
            <slot></slot>
        </Label>
        <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
        </NumberFieldContent>
    </NumberField>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import {
    NumberField,
    NumberFieldContent,
    NumberFieldDecrement,
    NumberFieldInput,
    NumberFieldIncrement,
} from '~/components/ui/number-field'
import { Label } from '~/components/ui/label'

const props = defineProps<{ modelValue: number }>()
const emit = defineEmits(['update:modelValue'])

const amount = computed({
    get: () => props.modelValue,
    set: (value: number) => {
        // Ensure the value is always a number
        if (isNaN(value)) {
            emit('update:modelValue', 0)
        } else {
            emit('update:modelValue', value)
        }
    },
})
</script>

<style scoped></style>
