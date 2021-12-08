import { CardSkill } from './Skill'

export type Card = {
    character: number
    stats: number[]
    hp: number
    attribute: number
    center: number
    skill: CardSkill
}
