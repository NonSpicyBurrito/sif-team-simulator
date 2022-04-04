import { EffectType } from '../../../database/Skill'
import { Live } from '../Live'
import { consumeAmp, doAmp } from '../skills/amp'
import { doCF } from '../skills/cf'
import { doEncore } from '../skills/encore'
import { doHeal } from '../skills/heal'
import { doParam } from '../skills/param'
import { doPlock } from '../skills/plock'
import { doPSU } from '../skills/psu'
import { doScore } from '../skills/score'
import { doSRU } from '../skills/sru'

export function activateCardSkill(
    live: Live,
    time: number,
    index: number,
    skillChanceMultiplier: number
) {
    const {
        card: { trigger, effect },
    } = live.context.skillInfos[index]

    if (VITE_APP_DIAGNOSTICS) {
        live.context.log(
            time,
            'Attempts to activate member',
            index,
            'with',
            (
                (trigger.chances[0] / 100 - live.context.skillChanceReduction) *
                skillChanceMultiplier
            ).toFixed(4),
            'card skill chance'
        )
    }

    if (
        Math.random() >=
        (trigger.chances[0] / 100 - live.context.skillChanceReduction) *
            skillChanceMultiplier
    )
        return false

    switch (effect.type) {
        case EffectType.Plock: {
            const level = consumeAmp(live)
            doPlock(live, time, index, effect.durations[level])
            break
        }
        case EffectType.Heal: {
            const level = consumeAmp(live)
            doHeal(live, time, index, effect.values[level])
            break
        }
        case EffectType.Score: {
            const level = consumeAmp(live)
            doScore(live, time, index, effect.values[level])
            break
        }
        case EffectType.SRU: {
            const level = consumeAmp(live)
            doSRU(
                live,
                time,
                index,
                effect.durations[level],
                effect.values[level] / 100
            )
            break
        }
        case EffectType.Encore:
            doEncore(live, time, index)
            break
        case EffectType.PSU: {
            const level = consumeAmp(live)
            doPSU(
                live,
                time,
                index,
                effect.durations[level],
                effect.values[level]
            )
            break
        }
        case EffectType.CF: {
            const level = consumeAmp(live)
            doCF(
                live,
                time,
                index,
                effect.durations[level],
                effect.values[level]
            )
            break
        }
        case EffectType.Amp: {
            const level = consumeAmp(live)
            doAmp(live, time, index, effect.values[level])
            break
        }
        case EffectType.Param: {
            const level = consumeAmp(live)
            doParam(
                live,
                time,
                index,
                effect.durations[level],
                effect.values[level] / 100
            )
            break
        }
        default:
            throw `Unsupported card effect: ${
                EffectType[effect.type] || effect.type
            }`
    }

    return true
}
