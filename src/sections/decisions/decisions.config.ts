export const EFFECT_INFO = {
    researchBase: {
        key: 'researchBase',
        name: 'Research Skill',
        actionName: 'Select Research Specialisation',
        ongoing: true,
        ghost: false,
        description: {
            summary:
                'Choose research and development as a key competence. Unlocks new processes and research grants.',
            onAdd: 'Costs 1 skill point',
        },
        type: 'skill',
        siblings: ['factoryBase'],
    },
    researchGrantFunding: {
        key: 'researchGrantFunding',
        name: 'Research Grant Funding',
        actionName: 'Apply for Research Grant',
        ongoing: true,
        ghost: false,
        description: {
            summary: 'Apply for a research grant to fund new research and development projects.',
            onAdd: 'Costs 2 skill points',
            onRoundChange:
                'A research grant will provide a small fixed income of £1,000 per round.',
        },
        type: 'skill',
        siblings: ['researchBase'],
    },
    productivityBase: {
        key: 'productivityBase',
        name: 'Productivity Skill',
        actionName: 'Select Productivity Specialisation',
        ongoing: true,
        ghost: false,
        description: {
            summary:
                'Develop production as a key competence. Unlocks productivity based skills, such as lowering costs and advanced processes.',
            onAdd: 'Costs 1 skill point',
        },
        type: 'skill',
        siblings: ['factoryBase'],
    },
    productivityFocus: {
        key: 'productivityFocus',
        name: 'Productivity Focus',
        actionName: 'Focus on Productivity',
        ongoing: true,
        ghost: false,
        description: {
            summary:
                'Double down and become real manufacturing experts. Provides a big reduction to the cost of production.',
            onAdd: 'Costs 2 skill points',
            onOrder: 'Reduces the cost of all manufacturing and production operations by 25%.',
        },
        type: 'skill',
        siblings: ['productivityBase'],
    },
    productivityUpgradeMachines: {
        key: 'productivityUpgradeMachines',
        name: 'Upgrade Machines',
        actionName: 'Upgrade Machines',
        ongoing: true,
        ghost: false,
        description: {
            summary:
                'Replace your old machines with new, more efficient ones, reducing the cost of production.',
            onAdd: 'Costs £10,000 to upgrade all machines',
            onOrder:
                'Reduces the cost of all manufacturing and production operations by a further 50%.',
        },
        type: 'skill',
        siblings: ['productivityBase', 'researchBase'],
    },
    efficiencyBase: {
        key: 'efficiencyBase',
        name: 'Efficiency Skill',
        actionName: 'Select Efficiency Specialisation',
        ongoing: true,
        ghost: false,
        description: {
            summary:
                'Develop efficiency as a key competence. Unlocks efficiency based skills, such as reduction of waste and lean principles.',
            onAdd: 'Costs 1 skill point',
        },
        type: 'skill',
        siblings: ['factoryBase'],
    },
    efficiencyFocus: {
        key: 'efficiencyFocus',
        name: 'Efficiency Focus',
        actionName: 'Focus on Efficiency',
        ongoing: true,
        ghost: false,
        description: {
            summary:
                'Invest more time and resources into efficiency improvements. Provides a boost to waste reduction and lean principles.',
            onAdd: 'Costs 2 skill points',
            onOrder: 'Reduces the waste produced by all manufacturing operations by 50%.',
        },
        type: 'skill',
        siblings: ['efficiencyBase'],
    },
    organisationBase: {
        key: 'organisationBase',
        name: 'Organisation Skill',
        actionName: 'Select Organisation Specialisation',
        ongoing: true,
        ghost: false,
        description: {
            summary:
                'Choose organisation as a key competence. Unlocks warehouse and material handling capabilities.',
            onAdd: 'Costs 1 skill point',
        },
        type: 'skill',
        siblings: ['factoryBase'],
    },
    organisationFocus: {
        key: 'organisationFocus',
        name: 'Organisation Focus',
        actionName: 'Focus on Organisation',
        ongoing: false,
        ghost: false,
        description: {
            summary: 'Invest in warehouse operations, allowing more items to be stored.',
            onAdd: 'Costs 2 skill points, and increases your warehouse capacity by 100 items',
        },
        type: 'skill',
        siblings: ['organisationBase'],
    },
    organisationInstallNewShelves: {
        key: 'organisationInstallNewShelves',
        name: 'New Shelving',
        actionName: 'Install New Shelving System',
        ongoing: false,
        ghost: false,
        description: {
            summary:
                'Install a new and improved shelving system, allowing more items to be stored.',
            onAdd: 'Costs £5,000, and increases your warehouse capacity by 50 items',
        },
        type: 'skill',
        siblings: ['organisationBase'],
    },
    financeBase: {
        key: 'financeBase',
        name: 'Finance Skill',
        actionName: 'Select Finance Specialisation',
        ongoing: true,
        ghost: false,
        description: {
            summary:
                'Develop finance as a key competence. Unlocks finance and legal based skills, such as more bank lending and investment.',
            onAdd: 'Costs 1 skill point',
        },
        type: 'skill',
        siblings: ['factoryBase'],
    },
    financeFocus: {
        key: 'financeFocus',
        name: 'Finance Focus',
        actionName: 'Focus on Finance',
        ongoing: false,
        ghost: false,
        description: {
            summary: 'Prioritise finance by setting up meetings with potential investors.',
            onAdd: 'Costs 2 skill points, but provides your business with an extra £15,000 for immediate use.',
        },
        type: 'skill',
        siblings: ['financeBase'],
    },
    financeHireEfficiencyTrainee: {
        key: 'financeHireEfficiencyTrainee',
        name: 'Efficiency Trainee',
        actionName: 'Hire Efficiency Trainee',
        ongoing: true,
        ghost: false,
        description: {
            summary: 'Hire an efficiency trainee, to help improve factory efficiency.',
            onAdd: 'Costs £5,000 in recruitment expenses.',
            onOrder: 'Reduces the waste produced by all manufacturing operations by 10%.',
        },
        type: 'skill',
        siblings: ['financeBase'],
    },
    financeHireManagementTrainee: {
        key: 'financeHireManagementTrainee',
        name: 'Management Trainee',
        actionName: 'Hire Management Trainee',
        ongoing: false,
        ghost: false,
        description: {
            summary:
                'Hire a management trainee, to help improve warehouse organisation and management.',
            onAdd: 'Costs £5,000 in recruitment expenses, and increases your warehouse capacity by 20 items.',
        },
        type: 'skill',
        siblings: ['financeBase'],
    },
    financeHireProductionTrainee: {
        key: 'financeHireProductionTrainee',
        name: 'Production Trainee',
        actionName: 'Hire Production Trainee',
        ongoing: true,
        ghost: false,
        description: {
            summary: 'Hire a production trainee, to help improve factory productivity.',
            onAdd: 'Costs £5,000 in recruitment expenses.',
            onOrder: 'Reduces the cost of all manufacturing and production operations by 10%.',
        },
        type: 'skill',
        siblings: ['financeBase'],
    },
    financeHireSalesTrainee: {
        key: 'financeHireSalesTrainee',
        name: 'Sales Trainee',
        actionName: 'Hire Sales Trainee',
        ongoing: true,
        ghost: false,
        description: {
            summary: 'Hire a sales trainee, to help improve sales and customer relations.',
            onAdd: 'Costs £5,000 in recruitment expenses, but instantly boosts your reputation by 2 points.',
        },
        type: 'skill',
        siblings: ['financeBase'],
    },
    salesBase: {
        key: 'salesBase',
        name: 'Sales Skill',
        actionName: 'Select Sales Specialisation',
        ongoing: true,
        ghost: false,
        description: {
            summary:
                'Choose to focus on sales and art of closing the deal. Unlocks sales based skills and fosters a higher reputation.',
            onAdd: 'Costs 1 skill point',
        },
        type: 'skill',
        siblings: ['factoryBase'],
    },
    salesFocus: {
        key: 'salesFocus',
        name: 'Sales Focus',
        actionName: 'Focus on Sales',
        ongoing: false,
        ghost: false,
        description: {
            summary: 'Make an effort to expand and improve relations with customers',
            onAdd: 'Costs 2 skill points, and increases your current reputation by 5 points.',
        },
        type: 'skill',
        siblings: ['salesBase'],
    },
    salesGiveQualityGuarantee: {
        key: 'salesGiveQualityGuarantee',
        name: 'Quality Guarantee',
        actionName: 'Provide Quality Guarantee With Sales',
        ongoing: false,
        ghost: false,
        description: {
            summary: 'Provide a guarantee of quality to customers with all product sales.',
            onAdd: 'Costs £5,000, and increases your current reputation by 2 points.',
        },
        type: 'skill',
        siblings: ['salesBase'],
    },
    negativesBase: {
        key: 'negativesBase',
        name: 'Negative Consequences',
        actionName: 'Negative Consequences',
        ongoing: true,
        ghost: true,
        description: { summary: '' },
        type: 'skill',
        siblings: [],
    },
    customerCompensation: {
        key: 'customerCompensation',
        name: 'Customer Compensation',
        actionName: 'Compensate Customer',
        ongoing: false,
        ghost: false,
        description: {
            summary:
                'A customer has called to complain. The order you supplied was of poor quality and has apparently ruined their big project. Would you like to compensate them?',
            onAdd: 'Costs £5,000.',
        },
        type: 'decision',
    },
    expandWarehouse: {
        key: 'expandWarehouse',
        name: 'Expand Warehouse',
        actionName: 'Expand Warehouse',
        ongoing: false,
        ghost: false,
        description: {
            summary:
                'You have the opportunity to expand your warehouse space by 100 units. Would you like to expand your warehouse?',
            onAdd: 'Costs £25,000.',
        },
        type: 'decision',
    },
    leaseWarehouseContract: {
        key: 'leaseWarehouseContract',
        name: 'Lease Warehouse Contract',
        actionName: 'Sign Lease Warehouse Contract',
        ongoing: true,
        ghost: false,
        description: {
            summary:
                "A neighbouring paint factory is desperate for more storage space. They've approached you to rent 50 slots of your warehouse capacity. They wish to store 20 orange paint, 20 green paint, and 10 solvent. You need at least 50 free warehouse space to accept the contract. They'll deliver immediately and collect in October (Round 10). Would you like to sign this contract?",
            onAdd: 'Items will be delivered to fill the leased space, and you will receive £5,000 for the lease.',
        },
        type: 'decision',
    },
    manufacturingContract: {
        key: 'manufacturingContract',
        name: 'Manufacturing Contract',
        actionName: 'Accept Manufacturing Contract',
        ongoing: false,
        ghost: false,
        description: {
            summary:
                'A close customer has been in touch to ask for a specific manufacturing job. They want 20 yellow paint and are willing to pay more than market rate for your product.',
            onOrder:
                'Up to 20 yellow paint will be deducted from the order to fulfill the contract. You will receive 2 times the market rate at the time of order placement.',
        },
        type: 'decision',
    },
    newYearMarketingCampaign: {
        key: 'newYearMarketingCampaign',
        name: 'New Year Marketing Campaign',
        actionName: 'Run New Year Marketing Campaign',
        ongoing: true,
        ghost: false,
        description: {
            summary:
                'Your marketing team would like to start the year with a big new PR promotion to raise the business reputation and launch onto social media. Maybe hire some influencers to represent the brand?',
            onAdd: 'Costs £5,000, and raises reputation by 5',
        },
        type: 'decision',
    },
    promotionalSupercar: {
        key: 'promotionalSupercar',
        name: 'Promotional Supercar',
        actionName: 'Buy Promotional Supercar',
        ongoing: false,
        ghost: false,
        description: {
            summary:
                "You've had a great idea of buying a supercar! It would be a great way of advertising the quality of your paints. Paid in yearly installments, and tax deductible as a company car you only need to put a partial payment now.",
            onAdd: 'Costs £8,000.',
        },
        type: 'decision',
    },
    solventMixUp: {
        key: 'solventMixUp',
        name: 'Solvent Mix-Up',
        actionName: 'Accept Solvent Mix-Up',
        ongoing: false,
        ghost: false,
        description: {
            summary:
                'A lorry has arrived at the gate with 20 barrels of solvent. There was apparently some mix up with an order. Would you like to take them at a reduced cost?',
            onAdd: 'Costs half the current market price for 20 solvent.',
        },
        type: 'decision',
    },
    staffPayRise: {
        key: 'staffPayRise',
        name: 'Staff Pay Rise',
        actionName: 'Give Staff Pay Rise',
        ongoing: false,
        ghost: false,
        description: {
            summary:
                "The staff want a pay rise. They do a good job, and we can't function without them. But this is a business and we're trying to make money here.",
            onAdd: 'Costs £5,000.',
        },
        type: 'decision',
    },
    supplyPromise: {
        key: 'supplyPromise',
        name: 'Supply Promise',
        actionName: 'Accept Supply Promise',
        ongoing: true,
        ghost: false,
        description: {
            summary:
                "An exciting new opportunity! A distributor has been in touch to ask for a specific supply job. They're looking to source up to 100 purple paint and are willing to pay triple the market rate for as much as you can supply! If you agree they'll be back next turn to collect.",
        },
        type: 'decision',
    },
    tradeShowFamousReputation: {
        key: 'tradeShowFamousReputation',
        name: 'Trade Show - Famous Reputation',
        actionName: 'Exhibit at Trade Show for Free',
        ongoing: false,
        ghost: false,
        description: {
            summary:
                "It's the September tradeshow season. Your reputation has preceded you! You're being invited to exhibit for free. Would you like to go? It's a great opportunity to showcase your products to the world.",
            onAdd: 'Costs £0.',
        },
        type: 'decision',
    },
    tradeShowManufacturingContract: {
        key: 'tradeShowManufacturingContract',
        name: 'Manufacturing Contract: Trade Show Contact',
        actionName: 'Accept Manufacturing Contract: Trade Show Contact',
        ongoing: false,
        ghost: false,
        description: {
            summary:
                'A customer you met at the trade show has been in touch to ask for a specific manufacturing job. They want 50 red paint and are willing to pay double the market rate for your product.',
            onOrder:
                'Up to 50 red paint will be deducted from the order to fulfill the contract. You will receive 2 times the market rate at the time of order placement.',
        },
        type: 'decision',
    },
    tradeShowNegativeReputation: {
        key: 'tradeShowNegativeReputation',
        name: 'Trade Show - Negative Reputation',
        actionName: 'Visit Trade Show',
        ongoing: false,
        ghost: false,
        description: {
            summary:
                "It's the September tradeshow season. But due to your terrible reputation you've not been invited to exhibit. Would you like to visit as a member of the public? You might still be able to make new contacts and opportunities even without a stand.",
            onAdd: 'Costs £500.',
        },
        type: 'decision',
    },
    tradeShowPositiveReputation: {
        key: 'tradeShowPositiveReputation',
        name: 'Trade Show - Positive Reputation',
        actionName: 'Exhibit at Trade Show',
        ongoing: false,
        ghost: false,
        description: {
            summary:
                "It's the September tradeshow season. Would you like to have a stand and showcase your products to the world? It's a great opportunity to make new business contacts.",
            onAdd: 'Costs £10,000.',
        },
        type: 'decision',
    },
    factoryBase: {
        key: 'factoryBase',
        name: 'Your Factory',
        actionName: '',
        ongoing: true,
        ghost: true,
        description: { summary: 'You are running a paint factory.' },
        type: 'skill',
        siblings: [],
    },
} as const
