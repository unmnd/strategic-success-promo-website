// import IntroSection from '../sections/intro/IntroSection.vue'
// import InteractivityNote from '../sections/intro/InteractivityNote.vue'
// import DecisionsSection from '../sections/decisions/DecisionsSection.vue'
// import SkillsSection from '../sections/skills/SkillsSection.vue'
// import MarketSection from '../sections/market/MarketSection.vue'
// import WarehouseSection from '../sections/warehouse/WarehouseSection.vue'
// import BankSection from '~/sections/bank/BankSection.vue'

// Import backgrounds
import darkGeneric from '~/assets/backgrounds/dark_generic.jpg'
import corporateGeneric from '~/assets/backgrounds/corporate_generic.jpg'
import finance from '~/assets/backgrounds/finance.jpg'
import warehouse from '~/assets/backgrounds/warehouse.jpg'

// Define all sections and their components in a single place
export const SECTIONS = [
    {
        id: 'intro',
        // component: IntroSection,
        background: null, // No background for intro
    },
    {
        id: 'interactivity',
        // component: InteractivityNote,
        background: null, // No background for interactivity note
    },
    {
        id: 'decisions',
        // component: DecisionsSection,
        background: darkGeneric,
    },
    {
        id: 'skills',
        // component: SkillsSection,
        background: corporateGeneric,
    },
    {
        id: 'market',
        // component: MarketSection,
        background: finance,
    },
    {
        id: 'warehouse',
        // component: WarehouseSection,
        background: warehouse,
    },
    {
        id: 'bank',
        // component: BankSection,
        background: finance,
    },
] as const
