import { EffectType } from '../../../database/Skill'
import { Live } from '../Live'

export function activateAccessorySkill(
    this: Live,
    time: number,
    index: number,
    skillChanceMultiplier: number
) {
    const { accessory } = this.context.skillInfos[index]
    if (!accessory) return

    const { effect, trigger } = accessory

    if (VITE_APP_DIAGNOSTICS) {
        this.context.log(
            'Attempts to activate member',
            index,
            'at',
            time,
            'with',
            (trigger.chances[0] * skillChanceMultiplier) / 100,
            'accessory skill chance'
        )
    }

    if (Math.random() >= (trigger.chances[0] * skillChanceMultiplier) / 100)
        return

    const level = this.consumeAmp()

    switch (effect.type) {
        case EffectType.Plock:
            this.doPlock(time, index, effect.durations[level])
            break
        case EffectType.Heal:
            this.doHeal(time, index, effect.values[level])
            break
        case EffectType.SRU:
            this.doSRU(
                time,
                index,
                effect.durations[level],
                effect.values[level] - 1
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
                effect.values[level] - 1
            )
            break
        default:
            throw `Unsupported accessory effect: ${EffectType[effect.type]}`
    }

    return true
}