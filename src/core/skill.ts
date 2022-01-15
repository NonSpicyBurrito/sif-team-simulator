import {
    AccessorySkill,
    CardSkill,
    EffectType,
    TriggerType,
} from '../database/Skill'
import { percent, thousands } from './formatting'

export function getSkillDescription(
    { trigger, effect }: CardSkill | AccessorySkill,
    level: number
) {
    const descriptions: string[] = []

    if ('type' in trigger) {
        const triggerValue = trigger.values[level - 1]

        switch (trigger.type) {
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
            case TriggerType.StarPerfect:
                descriptions.push(
                    `every ${triggerValue} perfects on star notes`
                )
                break
            default:
                descriptions.push(
                    `unsupported trigger: ${
                        TriggerType[trigger.type] || trigger.type
                    }`
                )
        }
    }

    const triggerChance = trigger.chances[level - 1]
    descriptions.push(`${percent(triggerChance / 100, 0)} chance`)

    const effectDuration = effect.durations[level - 1]
    const effectValue = effect.values[level - 1]

    switch (effect.type) {
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
                    'type' in trigger ? effectValue / 100 : effectValue - 1,
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
                    'type' in trigger ? effectValue / 100 : effectValue - 1,
                    0
                )}`,
                `for ${effectDuration} seconds`
            )
            break
        default:
            descriptions.push(
                `unsupported effect: ${EffectType[effect.type] || effect.type}`
            )
    }

    return descriptions.join(', ') + '. '
}

export function getSkillSimpleDescription({
    trigger,
    effect,
}: CardSkill | AccessorySkill) {
    const descriptions: string[] = []

    if ('type' in trigger) {
        const triggerValue = trigger.values[0]

        switch (trigger.type) {
            case TriggerType.Time:
                descriptions.push(`${triggerValue}s`)
                break
            case TriggerType.Note:
                descriptions.push(`${triggerValue}n`)
                break
            case TriggerType.Combo:
                descriptions.push(`${triggerValue}c`)
                break
            case TriggerType.Perfect:
                descriptions.push(`${triggerValue}p`)
                break
            case TriggerType.StarPerfect:
                descriptions.push(triggerValue.toString())
                break
            case TriggerType.Chain:
                descriptions.push('chain')
                break
            default:
                descriptions.push('?')
                break
        }
    }

    descriptions.push(EffectType[effect.type].toLowerCase() || '?')

    return descriptions.join(' ')
}
