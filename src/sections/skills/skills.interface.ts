import type { EFFECT_INFO } from '../decisions/decisions.config'

export const SKILL_TREE_NODE_RADIUS = 25
export const SKILL_TREE_LINK_LENGTH = 200
export const SKILL_TREE_LINK_STRENGTH = 0.5
export const SKILL_TREE_CHARGE_FORCE = -800

export type Node = d3.SimulationNodeDatum & {
    info: (typeof EFFECT_INFO)[keyof typeof EFFECT_INFO]
    id: string
    active: boolean
    selectable: boolean
}
export type Link = d3.SimulationLinkDatum<Node> & {
    source: Node
    target: Node
}
