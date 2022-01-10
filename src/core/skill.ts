import {
    AccessorySkill,
    CardSkill,
    EffectType,
    TriggerType,
} from '../database/Skill'
import { percent, thousands } from './formatting'

export function getSkillDescription(
    skill: CardSkill | AccessorySkill,
    level: number
) {
    const descriptions: string[] = []

    if ('type' in skill.trigger) {
        const triggerValue = skill.trigger.values[level - 1]

        switch (skill.trigger.type) {
            case TriggerType.Time:
                descriptions.push(`every ${triggerValue} seconds`)
                break
            case TriggerType.Note:
                descriptions.push(`every ${triggerValue} notes`)
                break
            case TriggerType.Combo:
                descriptions.push(`every ${triggerValue} combo`)
                break
            case TriggerType.Perfect:
                descriptions.push(`every ${triggerValue} perfects`)
                break
            default:
                descriptions.push(
                    `unsupported trigger: ${TriggerType[skill.trigger.type]}`
                )
        }
    }

    const triggerChance = skill.trigger.chances[level - 1]
    descriptions.push(`${percent(triggerChance / 100, 0)} chance`)

    const effectDuration = skill.effect.durations[level - 1]
    const effectValue = skill.effect.values[level - 1]

    switch (skill.effect.type) {
        case EffectType.Plock:
            descriptions.push(`perfect lock`, `for ${effectDuration} seconds`)
            break
        case EffectType.Heal:
            descriptions.push(`heal ${effectValue} hp`)
            break
        case EffectType.Score:
            descriptions.push(`add ${thousands(effectValue)} score`)
            break
        case EffectType.SRU:
            descriptions.push(
                `increase skill activation chance by ${percent(
                    'type' in skill.trigger
                        ? effectValue / 100
                        : effectValue - 1,
                    0
                )}`,
                `for ${effectDuration} seconds`
            )
            break
        case EffectType.Encore:
            descriptions.push('repeat last activated skill')
            break
        case EffectType.PSU:
            descriptions.push(
                `add ${thousands(effectValue)} score for every perfect`,
                `for ${effectDuration} seconds`
            )
            break
        case EffectType.CF:
            descriptions.push(
                `add ${thousands(effectValue)} to ${thousands(
                    effectValue * 10
                )} score for every combo`,
                `for ${effectDuration} seconds`
            )
            break
        case EffectType.Amp:
            descriptions.push(`increase skill level by ${effectValue}`)
            break
        case EffectType.Param:
            descriptions.push(
                `increase stat by ${percent(
                    'type' in skill.trigger
                        ? effectValue / 100
                        : effectValue - 1,
                    0
                )}`,
                `for ${effectDuration} seconds`
            )
            break
        default:
            descriptions.push(
                `unsupported effect: ${EffectType[skill.effect.type]}`
            )
    }

    return descriptions.join(', ') + '. '
}
