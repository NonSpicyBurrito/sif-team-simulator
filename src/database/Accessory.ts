import { AccessorySkill } from './Skill'

export type Accessory = {
    cardId: number
    stats: number[][]
    skill: AccessorySkill
}
