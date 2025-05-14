// Import backgrounds
import darkGeneric from '~/assets/backgrounds/dark_generic.jpg'
import corporateGeneric from '~/assets/backgrounds/corporate_generic.jpg'
import finance from '~/assets/backgrounds/finance.jpg'
import warehouse from '~/assets/backgrounds/warehouse.jpg'
import corporateMeeting from '~/assets/backgrounds/corporate_meeting.jpg'

// Define all sections and their components in a single place
export const SECTIONS = [
    {
        id: 'intro',
        component: () => import('../sections/intro/IntroSection.vue'),
        background: null, // No background for intro
    },
    {
        id: 'interactivity',
        component: () => import('../sections/intro/InteractivityNote.vue'),
        background: null, // No background for interactivity note
    },
    {
        id: 'decisions',
        component: () => import('../sections/decisions/DecisionsSection.vue'),
        background: darkGeneric,
    },
    {
        id: 'skills',
        component: () => import('../sections/skills/SkillsSection.vue'),
        background: corporateGeneric,
    },
    {
        id: 'market',
        component: () => import('../sections/market/MarketSection.vue'),
        background: finance,
    },
    {
        id: 'warehouse',
        component: () => import('../sections/warehouse/WarehouseSection.vue'),
        background: warehouse,
    },
    {
        id: 'manufacturing',
        component: () => import('../sections/manufacturing/ManufacturingSection.vue'),
        background: warehouse,
    },
    {
        id: 'bank',
        component: () => import('../sections/bank/BankSection.vue'),
        background: finance,
    },
    {
        id: 'trade',
        component: () => import('../sections/trade/TradeSection.vue'),
        background: corporateMeeting,
    },
] as const

// Export filtered sections for main content (excluding intro and interactivity)
export const MAIN_SECTIONS = SECTIONS.filter(
    (section) => !['intro', 'interactivity'].includes(section.id),
)

// Export section IDs for easy access
export const SECTION_IDS = SECTIONS.map((section) => section.id)
export const MAIN_SECTION_IDS = MAIN_SECTIONS.map((section) => section.id)
