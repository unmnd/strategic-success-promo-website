import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { SECTIONS } from './config/stage.config'
import { computed } from 'vue'
import { useBackgroundStore } from './stores/background'

// Create routes from SECTIONS array
const routes: RouteRecordRaw[] = SECTIONS.map((section) => ({
  path: `/${section.id}`,
  name: section.id,
  component: section.component,
}))

// Make / redirect to intro
routes.push({
  path: '/',
  redirect: '/intro',
})

// Create router instance
export const router = createRouter({
  history: createWebHistory(),
  routes,
})

export const currentRoute = computed(() => {
  return router.currentRoute.value
})

// Add navigation guard to handle background changes
router.beforeEach((to) => {
  const section = SECTIONS.find((s) => s.id === to.name)
  if (section) {
    const backgroundStore = useBackgroundStore()
    backgroundStore.setBackground(section.background)
  }
  return true
})

export function goToNextSection() {
  const currentSectionIndex = SECTIONS.findIndex(
    (section) => section.id === currentRoute.value.name,
  )
  const nextIndex = (currentSectionIndex + 1) % SECTIONS.length
  router.push(SECTIONS[nextIndex].id)
}

export function goToPreviousSection() {
  const currentSectionIndex = SECTIONS.findIndex(
    (section) => section.id === currentRoute.value.name,
  )
  const previousIndex = (currentSectionIndex - 1 + SECTIONS.length) % SECTIONS.length
  router.push(SECTIONS[previousIndex].id)
}
