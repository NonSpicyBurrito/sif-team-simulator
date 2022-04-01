import { Live } from '../Live'
import { activateAccessorySkill } from './accessory-skill'
import { activateCardSkill } from './card-skill'
import { activateSelfCoverage } from './self-coverage'

export function activate(
    live: Live,
    time: number,
    index: number,
    skillChanceMultiplier: number
) {
    if (activateSelfCoverage(live, index)) return
    if (activateCardSkill(live, time, index, skillChanceMultiplier)) return
    if (activateAccessorySkill(live, time, index)) return
}
