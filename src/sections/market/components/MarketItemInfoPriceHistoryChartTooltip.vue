<template>
  <Card class="text-sm">
    <CardTitle class="p-3">
      {{ price ? formatter(Number(price)) : 'N/A' }}
    </CardTitle>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { formatter } from '~/utils'
import { Card, CardTitle } from '~/components/ui/card'

const props = defineProps<{
  title?: string
  data: {
    name: string
    color: string
    value: any // eslint-disable-line @typescript-eslint/no-explicit-any
  }[]
}>()

const price = computed(() => props.data.find((item) => item.name === 'price')?.value)
</script>
