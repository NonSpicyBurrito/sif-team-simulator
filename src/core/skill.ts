import {
    AccessorySkill,
    CardSkill,
    EffectType,
    TriggerType,
} from '../database/Skill'

export function getSkillDescription(
    skill: CardSkill | AccessorySkill,
    level: number
) {
    const descriptions: string[] = []

    if ('type' in skill.trigger) {
        const triggerValue = skill.trigger.values[level - 1]

        switch (skill.trigger.type) {
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
    descriptions.push(`${triggerChance}% chance`)

    const effectDuration = skill.effect.durations[level - 1]
    const effectValue = skill.effect.values[level - 1]

    switch (skill.effect.type) {
        case EffectType.Score:
            descriptions.push(`add ${effectValue} score`)
            break
        case EffectType.Heal:
            descriptions.push(`heal ${effectValue} hp`)
            break
        case EffectType.Plock:
            descriptions.push(`perfect lock`, `for ${effectDuration} seconds`)
            break
        case EffectType.PSU:
            descriptions.push(
                `add ${effectValue} score for every perfect`,
                `for ${effectDuration} seconds`
            )
            break
        case EffectType.CF:
            descriptions.push(
                `add ${effectValue} to ${
                    effectValue * 10
                } score for every combo`,
                `for ${effectDuration} seconds`
            )
            break
        case EffectType.Param:
            descriptions.push(
                `increase stat by ${effectValue}%`,
                `for ${effectDuration} seconds`
            )
            break
        case EffectType.Amp:
            descriptions.push(`increase skill level by ${effectValue}`)
            break
        case EffectType.SRU:
            descriptions.push(
                `increase skill activation chance by ${effectValue}%`,
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
