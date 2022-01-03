/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { accessories, cards, sises } from '../database'
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
    guestCenter: number
) {
    const { attribute, center } = cards.get(team[4].card.id)!

    const result = {
        base: 0,
        param: 0,
        trick: 0,
    }

    let teamSisMultiplier = 0
    const selfSisMultipliers = team.map(() => 0)
    const flatSisBonuses = team.map(() => 0)
    const trickMultipliers = team.map(() => 0)
    team.forEach((member, i) =>
        member.sisNames.forEach((name) => {
            const sis = sises.get(name)!
            switch (sis.type) {
                case 'self':
                    selfSisMultipliers[i] += sis.value
                    break
                case 'team':
                    teamSisMultiplier += sis.value
                    break
                case 'flat':
                    flatSisBonuses[i] += sis.value
                    break
                case 'plock':
                    trickMultipliers[i] = sis.value
                    break
            }
        })
    )

    const centerMultiplier = center / 100 + guestCenter

    team.forEach((member, i) => {
        const raw = getRawMemberStats(member, memoryGalleryBonus)[attribute]

        const accessoryBonus = member.accessory
            ? accessories.get(member.accessory.id)!.stats[
                  member.accessory.level - 1
              ][attribute]
            : 0

        const panel =
            (raw + accessoryBonus) * (1 + selfSisMultipliers[i]) +
            flatSisBonuses[i]
        const affected = panel * (1 + teamSisMultiplier + centerMultiplier)

        result.base +=
            (raw * teamSisMultiplier + panel) * (1 + centerMultiplier)
        result.param += affected
        result.trick += affected * trickMultipliers[i]
    })

    return result
}
