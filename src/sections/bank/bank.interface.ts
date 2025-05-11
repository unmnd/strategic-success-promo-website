export interface Transaction {
    reference: string
    amount: number
    endBalance: number
    round: number
    timestamp: number
}

export interface BankStats {
    roundIncome: number
    roundExpenses: number
    totalIncome: number
    totalExpenses: number
}
