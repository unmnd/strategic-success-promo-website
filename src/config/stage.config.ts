import IntroSection from '../sections/intro/IntroSection.vue'
import InteractivityNote from '../sections/intro/InteractivityNote.vue'
import DecisionsSection from '../sections/decisions/DecisionsSection.vue'
import SkillsSection from '../sections/skills/SkillsSection.vue'
import MarketSection from '../sections/market/MarketSection.vue'

// Define all sections and their components in a single place
export const SECTIONS = [
  {
    id: 'intro',
    component: IntroSection,
  },
  {
    id: 'interactivity',
    component: InteractivityNote,
  },
  {
    id: 'decisions',
    component: DecisionsSection,
  },
  {
    id: 'skills',
    component: SkillsSection,
  },
  {
    id: 'market',
    component: MarketSection,
  },
] as const
