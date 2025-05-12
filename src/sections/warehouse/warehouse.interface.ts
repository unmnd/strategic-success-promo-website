export interface WarehouseItem {
    id: string
    name: string
    quantity: number
    maxQuantity: number
    spacePerUnit: number
    value: number
}

export interface WarehouseState {
    items: WarehouseItem[]
    totalSpace: number
    usedSpace: number
}
