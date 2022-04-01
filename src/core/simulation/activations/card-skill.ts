import { EffectType } from '../../../database/Skill'
import { Live } from '../Live'

export function activateCardSkill(
    this: Live,
    time: number,
    index: number,
    skillChanceMultiplier: number
) {
    const {
        card: { trigger, effect },
    } = this.context.skillInfos[index]

    if (VITE_APP_DIAGNOSTICS) {
        this.context.log(
            time,
            'Attempts to activate member',
            index,
            'with',
            (
                (trigger.chances[0] / 100 - this.context.skillChanceReduction) *
                skillChanceMultiplier
            ).toFixed(4),
            'card skill chance'
        )
    }

    if (
        Math.random() >=
        (trigger.chances[0] / 100 - this.context.skillChanceReduction) *
            skillChanceMultiplier
    )
        return false

    const level = this.consumeAmp()

    switch (effect.type) {
        case EffectType.Plock:
            this.doPlock(time, index, effect.durations[level])
            break
        case EffectType.Heal:
            this.doHeal(time, index, effect.values[level])
            break
        case EffectType.Score:
            this.doScore(time, index, effect.values[level])
            break
        case EffectType.SRU:
            this.doSRU(
                time,
                index,
                effect.durations[level],
                effect.values[level] / 100
            )
            break
        case EffectType.Encore:
            this.doEncore(time, index)
            break
        case EffectType.PSU:
            this.doPSU(
                time,
                index,
                effect.durations[level],
                effect.values[level]
            )
            break
        case EffectType.CF:
            this.doCF(
                time,
                index,
                effect.durations[level],
                effect.values[level]
            )
            break
        case EffectType.Amp:
            this.doAmp(effect.values[level])
            break
        case EffectType.Param:
            this.doParam(
                time,
                index,
                effect.durations[level],
                effect.values[level] / 100
            )
            break
        default:
            throw `Unsupported card effect: ${
                EffectType[effect.type] || effect.type
            }`
    }

    return true
}
