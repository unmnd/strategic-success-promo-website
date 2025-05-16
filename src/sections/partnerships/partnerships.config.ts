export const clauses = {
    OngoingPaymentClause: {
        title: 'Ongoing Payment',
        description: 'A per-round payment from one team to another.',
        icon: 'ri-money-dollar-circle-line',
    },

    OneTimePaymentClause: {
        title: 'One-Time Payment',
        description: 'A single payment from one team to another at a specific round.',
        icon: 'ri-money-dollar-circle-line',
    },

    LoanClause: {
        title: 'Loan',
        description: 'A loan from one team to another, with a specified duration and interest.',
        icon: 'ri-money-dollar-circle-line',
    },

    RevenueShareClause: {
        title: 'Revenue Share',
        description: 'A share of revenue from one team to another based on a proportion.',
        icon: 'ri-money-dollar-circle-line',
    },

    ProfitShareClause: {
        title: 'Profit Share',
        description: 'A share of profit from one team to another based on a proportion.',
        icon: 'ri-money-dollar-circle-line',
    },

    BreachFineClause: {
        title: 'Breach of Clause Fine',
        description:
            'A fine for breaching a partnership agreement. A fixed penalty is applied for each breach, and the money is shared between the other partners.',
        icon: 'ri-error-warning-line',
    },

    EndPartnershipOnBreachClause: {
        title: 'End Partnership on Breach',
        description: 'The partnership is nullified if a specified number of breaches occur.',
        icon: 'ri-error-warning-line',
    },

    EndPartnershipOnRoundClause: {
        title: 'End Partnership on Round',
        description: 'The partnership is nullified after a specified round.',
        icon: 'ri-error-warning-line',
    },

    TransparencyReportSpendingClause: {
        title: 'Transparency Report: Spending',
        description:
            'Share all spending and transactions in a per-round report with all members of the partnership.',
        icon: 'ri-mail-open-line',
    },

    TransparencyReportInventoryClause: {
        title: 'Transparency Report: Inventory',
        description:
            'Share the contents of the team inventory in a per-round report with all members of the partnership.',
        icon: 'ri-mail-open-line',
    },

    OneTimeSupplyAgreementClause: {
        title: 'One-Time Supply Agreement',
        description: 'A single trade of items from one team to another.',
        icon: 'ri-truck-line',
    },

    OngoingSupplyAgreementClause: {
        title: 'Ongoing Supply Agreement',
        description: 'An ongoing trade of items from one team to another.',
        icon: 'ri-truck-line',
    },

    ExclusiveTradingRightsClause: {
        title: 'Exclusive Trading Rights',
        description: 'Permit a team to trade a specific item only with one other team.',
        icon: 'ri-truck-line',
    },

    NonCompeteTradingRightsClause: {
        title: 'Non-Compete Trading Rights',
        description: 'Restrict a team from trading, buying, or selling a specific item.',
        icon: 'ri-truck-line',
    },

    ExclusivePartnershipClause: {
        title: 'Exclusive Partnership',
        description: 'Allow only this partnership to be active for a team.',
        icon: 'ri-service-line',
    },

    NoNewPartnershipsClause: {
        title: 'No New Partnerships',
        description:
            'Restrict a team from forming new partnerships while this partnership is active.',
        icon: 'ri-service-line',
    },

    TransferSkillPointsClause: {
        title: 'Transfer Skill Points',
        description: 'A one-time transfer of skill points from one team to another.',
        icon: 'ri-tools-line',
    },

    CakeClause: {
        title: 'Cake Clause',
        description:
            'Cake must be provided to all members of the partnership on any event, celebration, or milestone.',
        icon: 'ri-cake-2-line',
    },

    ShareItemOrderRecipe: {
        title: 'Share Manufacturing Order Recipe',
        description: 'Share the recipe for a manufacturing order from one team to another.',
        icon: 'ri-truck-line',
    },
}

export const clauseGroups = [
    {
        heading: 'Financial',
        clauses: [
            'OngoingPaymentClause',
            'OneTimePaymentClause',
            'LoanClause',
            'RevenueShareClause',
            'ProfitShareClause',
        ],
    },
    {
        heading: 'Partnership Management',
        clauses: [
            'BreachFineClause',
            'EndPartnershipOnBreachClause',
            'EndPartnershipOnRoundClause',
            'ExclusivePartnershipClause',
            'NoNewPartnershipsClause',
        ],
    },
    {
        heading: 'Trade',
        clauses: [
            'OneTimeSupplyAgreementClause',
            'OngoingSupplyAgreementClause',
            'ExclusiveTradingRightsClause',
            'NonCompeteTradingRightsClause',
            'ShareItemOrderRecipe',
        ],
    },
    {
        heading: 'Reporting',
        clauses: ['TransparencyReportSpendingClause', 'TransparencyReportInventoryClause'],
    },
    {
        heading: 'Skill Points',
        clauses: ['TransferSkillPointsClause'],
    },
    {
        heading: 'Miscellaneous',
        clauses: ['CakeClause'],
    },
]
