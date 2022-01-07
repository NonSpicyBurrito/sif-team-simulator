import { Live } from '../Live'

export function activate(
    this: Live,
    time: number,
    index: number,
    skillChanceMultiplier: number
) {
    if (this.activateSelfCoverage(index)) return
    if (this.activateCardSkill(time, index, skillChanceMultiplier)) return
    if (this.activateAccessorySkill(time, index, skillChanceMultiplier)) return
}
