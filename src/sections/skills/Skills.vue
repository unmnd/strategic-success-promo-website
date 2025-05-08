<template>
  <div class="flex flex-col space-y-8">
    <div class="grid grid-cols-2 gap-4">
      <div
        v-for="skill in skills"
        :key="skill.id"
        class="bg-card p-4 rounded-lg shadow-md hover:shadow-lg transition-all"
      >
        <div class="flex justify-between">
          <h3 class="text-lg font-medium mb-2">{{ skill.name }}</h3>
          <div class="flex items-center gap-1">
            <div
              v-for="i in 5"
              :key="i"
              :class="['w-3 h-3 rounded-full', i <= skill.level ? 'bg-primary' : 'bg-muted']"
            ></div>
          </div>
        </div>
        <p class="text-sm text-muted-foreground">{{ skill.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Mock skill data
const skills = ref([
  {
    id: 'finance',
    name: 'Finance',
    level: 2,
    description: 'Understanding of financial statements, budgeting, and cash flow management.',
  },
  {
    id: 'marketing',
    name: 'Marketing',
    level: 3,
    description: 'Ability to promote products and reach target audiences effectively.',
  },
  {
    id: 'logistics',
    name: 'Logistics',
    level: 1,
    description: 'Management of supply chain and delivery operations.',
  },
  {
    id: 'hr',
    name: 'HR Management',
    level: 2,
    description: 'Talent acquisition, team building, and employee development.',
  },
])
</script>

<style scoped></style>
