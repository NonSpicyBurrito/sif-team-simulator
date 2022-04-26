import { activate } from '../activations'
import { sortTriggers } from '../Context'
import { Live } from '../Live'

export function tickSkills(live: Live, time: number, triggers: [number][]) {
    live.purgeLastSkill = false
    live.tempLastSkill = undefined
    live.tempAmp = 0

    const skillChanceMultiplier =
        (1 + live.context.skillChanceBonus) * (1 + live.sruState.value)

    sortTriggers(triggers, live.context.priorities[live.coinFlip ? 0 : 1])
    triggers.forEach(([i]) => activate(live, time, i, skillChanceMultiplier))

    live.lastSkill =
        live.tempLastSkill || (live.purgeLastSkill ? undefined : live.lastSkill)

    live.ampState = live.tempAmp || live.ampState
}
