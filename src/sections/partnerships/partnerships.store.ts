import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePartnershipsStore = defineStore('partnerships', () => {
    const partnerships = ref<string[]>([])

    function addPartnership(partnership: string) {
        if (!partnerships.value.includes(partnership)) {
            partnerships.value.push(partnership)
        }
    }

    return {
        partnerships,
        addPartnership,
    }
})
