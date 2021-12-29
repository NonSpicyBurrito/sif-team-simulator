import { AccessorySkill } from './Skill'

export type Accessory = {
    character: number
    stats: number[][]
    skill: AccessorySkill
}
