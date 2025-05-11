import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Transaction, BankStats } from './bank.interface'

// Helper function to generate random amount within range
function randomAmount(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

// Transaction templates with value ranges and base probabilities
const TRANSACTION_TEMPLATES = {
    // Income transactions
    SALES_REVENUE: { min: 1500000, max: 2500000, baseProbability: 0.3 },
    RESEARCH_GRANT: { min: 1200000, max: 2000000, baseProbability: 0.1 },
    ECO_SUPPLIER_CONTRACT: { min: 2800000, max: 4000000, baseProbability: 0.1 },
    PATENT_LICENSING: { min: 3500000, max: 5000000, baseProbability: 0.1 },
    GOVERNMENT_INCENTIVE: { min: 1500000, max: 2500000, baseProbability: 0.1 },
    INVESTMENT_RETURN: { min: 2000000, max: 3500000, baseProbability: 0.1 },

    // Expense transactions
    WAREHOUSE_LEASE: { min: -3000000, max: -2000000, baseProbability: 0.1 },
    EQUIPMENT_MAINTENANCE: { min: -1500000, max: -800000, baseProbability: 0.2 },
    EMPLOYEE_TRAINING: { min: -1200000, max: -600000, baseProbability: 0.1 },
    WAREHOUSE_UPGRADE: { min: -2000000, max: -1000000, baseProbability: 0.1 },
    SOLVENT_RESEARCH: { min: -3500000, max: -2000000, baseProbability: 0.1 },
    SUPPLY_CHAIN_AUDIT: { min: -1200000, max: -700000, baseProbability: 0.1 },
    WASTE_MANAGEMENT: { min: -1000000, max: -500000, baseProbability: 0.1 },
    WORKER_BONUS: { min: -1500000, max: -800000, baseProbability: 0.1 },
    TRADE_SHOW: { min: -1200000, max: -700000, baseProbability: 0.1 },
    ACCOUNTS_TEAM: { min: -1000000, max: -600000, baseProbability: 0.1 },
}

// Configuration for balance targeting
const BALANCE_CONFIG = {
    targetBalance: 15000000,
    startingBalance: 5000000,
    probabilityAdjustment: 0.1, // 10% adjustment factor
    maxTransactions: 25,
}

// Helper function to adjust probabilities based on current balance
function adjustProbabilities(currentBalance: number): Record<string, number> {
    const balanceRatio = currentBalance / BALANCE_CONFIG.targetBalance
    const adjustment = BALANCE_CONFIG.probabilityAdjustment

    return Object.entries(TRANSACTION_TEMPLATES).reduce(
        (acc, [key, template]) => {
            const isIncome = template.min > 0
            let adjustedProb = template.baseProbability

            if (isIncome) {
                // Increase income probability if balance is low
                adjustedProb *= 1 + (1 - balanceRatio) * adjustment
            } else {
                // Increase expense probability if balance is high
                adjustedProb *= 1 + (balanceRatio - 1) * adjustment
            }

            acc[key] = Math.max(0.01, Math.min(0.99, adjustedProb))
            return acc
        },
        {} as Record<string, number>,
    )
}

// Helper function to select a transaction based on adjusted probabilities
function selectTransaction(adjustedProbs: Record<string, number>): {
    reference: string
    amount: number
} {
    const entries = Object.entries(adjustedProbs)
    const totalProb = entries.reduce((sum, [_, prob]) => sum + prob, 0)
    let random = Math.random() * totalProb

    for (const [reference, prob] of entries) {
        random -= prob
        if (random <= 0) {
            const template = TRANSACTION_TEMPLATES[reference as keyof typeof TRANSACTION_TEMPLATES]
            return {
                reference,
                amount: randomAmount(template.min, template.max),
            }
        }
    }

    // Fallback to first transaction if something goes wrong
    const firstRef = entries[0][0]
    const template = TRANSACTION_TEMPLATES[firstRef as keyof typeof TRANSACTION_TEMPLATES]
    return {
        reference: firstRef,
        amount: randomAmount(template.min, template.max),
    }
}

export const useBankStore = defineStore('bank', () => {
    const balance = ref(BALANCE_CONFIG.startingBalance)
    const transactions = ref<Transaction[]>([])
    const stats = ref<BankStats>({
        roundIncome: 0,
        roundExpenses: 0,
        totalIncome: 0,
        totalExpenses: 0,
    })

    // Generate n random timestamps within the last 30 days, sorted in increasing order (oldest first)
    function generateTimestamps(length: number): number[] {
        const now = Date.now()
        const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000
        const timestamps: number[] = []
        for (let i = 0; i < length; i++) {
            const ts = Math.floor(Math.random() * (now - thirtyDaysAgo)) + thirtyDaysAgo
            timestamps.push(ts)
        }
        // Sort in increasing order (oldest first)
        timestamps.sort((a, b) => a - b)
        return timestamps
    }

    function generateRounds(length: number): number[] {
        // Pick a random max round between 5 and 11 (inclusive)
        const maxRound = Math.floor(Math.random() * 7) + 5 // 5..11
        const rounds: number[] = []
        for (let i = 0; i < length; i++) {
            // For each index, generate a random round between 0 and maxRound (inclusive)
            rounds.push(Math.floor(Math.random() * (maxRound + 1)))
        }
        // Sort rounds to increase with index
        rounds.sort((a, b) => a - b)
        return rounds
    }

    // Generate all transactions
    function generateTransactions() {
        let currentBalance = balance.value
        const newTransactions: Transaction[] = []
        const timestamps = generateTimestamps(BALANCE_CONFIG.maxTransactions)
        const rounds = generateRounds(BALANCE_CONFIG.maxTransactions)

        while (newTransactions.length < BALANCE_CONFIG.maxTransactions) {
            const adjustedProbs = adjustProbabilities(currentBalance)
            const { reference, amount } = selectTransaction(adjustedProbs)
            const timestamp = timestamps[newTransactions.length]
            const round = rounds[newTransactions.length]

            const transaction: Transaction = {
                reference,
                amount,
                endBalance: currentBalance + amount,
                round,
                timestamp,
            }

            currentBalance = transaction.endBalance
            newTransactions.push(transaction)

            // Update stats
            if (amount > 0) {
                stats.value.totalIncome += amount
                if (round === Math.max(...rounds)) {
                    stats.value.roundIncome += amount
                }
            } else {
                stats.value.totalExpenses += amount
                if (round === Math.max(...rounds)) {
                    stats.value.roundExpenses += amount
                }
            }
        }

        // Sort transactions by timestamp
        // transactions.value = newTransactions.sort((a, b) => b.timestamp - a.timestamp)
        transactions.value = newTransactions.reverse()
        balance.value = currentBalance
    }

    // Initialize transactions
    generateTransactions()

    return {
        balance,
        transactions,
        stats,
        generateTransactions,
    }
})
