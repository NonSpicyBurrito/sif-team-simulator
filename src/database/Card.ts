import { CenterSkill } from './Center'
import { CardSkill } from './Skill'

export enum Rarity {
    R = 2,
    SR = 3,
    SSR = 5,
    UR = 4,
}

export type Card = {
    character: number
    rarity: Rarity
    stats: number[]
    hp: number
    attribute: number
    center: CenterSkill
    skill: CardSkill
}
