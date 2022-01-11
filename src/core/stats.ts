/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { accessories, cards, charts, sises } from '../database'
import { CenterEffectType, CenterSkill } from '../database/Center'
import { Member, Team } from './Team'

function getRawMemberStats(member: Member, memoryGalleryBonus: number[]) {
    const card = cards.get(member.card.id)
    if (!card) throw 'Card not found'

    const bonus = [16, 17, 18, 19, 20]
        .map(
            (amount, index) =>
                amount *
                Math.max(0, Math.min(20, member.card.level - 100 - index * 20))
        )
        .reduce((sum, value) => sum + value, 0)

    const stats = card.stats.map(
        (value, index) => value + bonus + memoryGalleryBonus[index]
    )
    stats[card.attribute] += 1000

    return stats
}

export function calculateTeamStat(
    team: Team,
    memoryGalleryBonus: number[],
    chartId: string,
    guestCenter: number
) {
    const { attribute } = charts.get(chartId)!
    const { center } = cards.get(team[4].card.id)!

    const results = [...Array(3)].map(() => ({
        base: 0,
        param: 0,
        trick: 0,
    }))

    const centerMultiplier = [0, 0, 0]
    const teamSisMultiplier = [0, 0, 0]
    const selfSisMultipliers = team.map(() => [0, 0, 0])
    const flatSisBonuses = team.map(() => [0, 0, 0])
    const trickMultipliers = team.map(() => [0, 0, 0])
    team.forEach((member, i) =>
        member.sisNames.forEach((name) => {
            const sis = sises.get(name)!
            switch (sis.type) {
                case 'self':
                    selfSisMultipliers[i][attribute] += sis.value
                    break
                case 'team':
                    teamSisMultiplier[attribute] += sis.value
                    break
                case 'flat':
                    flatSisBonuses[i][attribute] += sis.value
                    break
                case 'plock':
                    trickMultipliers[i][attribute] = sis.value
                    break
            }
        })
    )

    centerMultiplier[attribute] += guestCenter

    const intermediate = team.map((member, i) =>
        getRawMemberStats(member, memoryGalleryBonus).map((raw, j) => {
            const accessoryBonus = member.accessory
                ? accessories.get(member.accessory.id)!.stats[
                      member.accessory.level - 1
                  ][j]
                : 0

            const panel =
                (raw + accessoryBonus) * (1 + selfSisMultipliers[i][j]) +
                flatSisBonuses[i][j]

            return {
                panel,
                affected: panel * (1 + teamSisMultiplier[j]),
                base: raw * teamSisMultiplier[j] + panel,
            }
        })
    )

    intermediate.forEach((member, i) =>
        member.forEach(({ panel, affected, base }, j) => {
            base +=
                base * centerMultiplier[j] +
                applyCenter(
                    center,
                    member.map(({ base }) => base),
                    j
                )
            affected +=
                panel * centerMultiplier[j] +
                applyCenter(
                    center,
                    member.map(({ panel }) => panel),
                    j
                )

            results[j].base += base
            results[j].param += affected
            results[j].trick += affected * trickMultipliers[i][j]
        })
    )

    return results
}

function applyCenter(center: CenterSkill, stats: number[], attribute: number) {
    return (
        applyCenterEffect(
            center.main.type,
            center.main.value / 100,
            stats,
            attribute
        ) +
        (center.extra.type && center.extra.value
            ? applyCenterEffect(
                  center.extra.type,
                  center.extra.value / 100,
                  stats,
                  attribute
              )
            : 0)
    )
}

function applyCenterEffect(
    type: CenterEffectType,
    value: number,
    stats: number[],
    attribute: number
) {
    switch (type) {
        case CenterEffectType.SmilePrincess:
            return [1, 0, 0][attribute] * value * stats[0]
        case CenterEffectType.PureAngel:
            return [0, 1, 0][attribute] * value * stats[1]
        case CenterEffectType.CoolEmpress:
            return [0, 0, 1][attribute] * value * stats[2]
        case CenterEffectType.PurePrincess:
            return [0, 1, 0][attribute] * value * stats[0]
        case CenterEffectType.CoolPrincess:
            return [0, 0, 1][attribute] * value * stats[0]
        case CenterEffectType.SmileAngel:
            return [1, 0, 0][attribute] * value * stats[1]
        case CenterEffectType.CoolAngel:
            return [0, 0, 1][attribute] * value * stats[1]
        case CenterEffectType.SmileEmpress:
            return [1, 0, 0][attribute] * value * stats[2]
        case CenterEffectType.PureEmpress:
            return [0, 1, 0][attribute] * value * stats[2]
        default:
            throw `Unsupported center effect: ${CenterEffectType[type] || type}`
    }
}
