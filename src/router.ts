import { createRouter, createWebHistory } from 'vue-router'
import { SECTIONS } from './config/stage.config'
import { computed } from 'vue'

// Create routes from SECTIONS array
const routes = SECTIONS.map((section) => ({
  path: `/${section.id}`,
  name: section.id,
  component: section.component,
}))

// // Add default route
// routes.push({
//   path: '/',
//   name: 'intro',
//   component: () => import('~/sections/intro/IntroSection.vue'),
// })

// Create router instance
export const router = createRouter({
  history: createWebHistory(),
  routes,
})

export const currentRoute = computed(() => {
  return router.currentRoute.value
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
