import { EffectType } from '../../../database/Skill'
import { activate } from '../activations'
import { Live } from '../Live'

export function tickSkills(live: Live, time: number, triggers: [number][]) {
    live.purgeLastSkill = false
    live.tempLastSkill = undefined
    live.tempAmp = 0

    const skillChanceMultiplier =
        (1 + live.context.skillChanceBonus) * (1 + live.sruState.value)

    if (live.coinFlip && triggers.length >= 3) {
        let hasAmp = false
        let hasEncore = false
        let hasNormal = false

        triggers.forEach(([i]) => {
            switch (live.context.skillInfos[i].card.effect.type) {
                case EffectType.Amp:
                    hasAmp = true
                    break
                case EffectType.Encore:
                    hasEncore = true
                    break
                default:
                    hasNormal = true
                    break
            }
        })

        if (hasAmp && hasEncore && hasNormal) {
            live.context.sortTriggers(triggers, live.context.coinFlipPriorities)
        }
    }

    triggers.forEach(([i]) => activate(live, time, i, skillChanceMultiplier))

    live.lastSkill =
        live.tempLastSkill || (live.purgeLastSkill ? undefined : live.lastSkill)

    if (!live.ampState && live.tempAmp) {
        if (VITE_APP_DIAGNOSTICS) {
            live.context.log(time, 'Amp', live.tempAmp, 'activates')
        }

        live.ampState = live.tempAmp
    }
}
