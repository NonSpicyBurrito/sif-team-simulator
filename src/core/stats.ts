/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { accessories, cards, charts, sises } from '../database'
import { Card, Group, Subunit } from '../database/Card'
import {
    CenterApplyType,
    CenterEffectType,
    CenterSkill,
} from '../database/Center'
import { CharacterId } from '../database/Character'
import { Member, Team } from './Team'

const jewelBonus = [
    [100, 0],
    [20, 16],
    [20, 17],
    [20, 18],
    [20, 19],
    [20, 20],
    [10, 21],
    [10, 22],
    [10, 23],
    [10, 24],
    [10, 25],
    [10, 26],
    [10, 27],
    [10, 28],
    [10, 29],
    [10, 30],
    [10, 31],
    [10, 32],
    [10, 33],
    [10, 34],
    [10, 35],
].map(([max, perLevel], i, self) => [
    self.slice(0, i).reduce((sum, [levels]) => sum + levels, 0),
    max,
    perLevel,
])

function getRawMemberStats(member: Member, memoryGalleryBonus: number[]) {
    const card = cards.get(member.card.id)
    if (!card) throw 'Card not found'

    const bonus = jewelBonus
        .map(
            ([from, max, perLevel]) =>
                Math.max(0, Math.min(max, member.card.level - from)) * perLevel
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
    guestCenter: CenterSkill
) {
    const { attribute } = charts.get(chartId)!
    const { center } = cards.get(team[4].card.id)!

    const results = [...Array(3)].map(() => ({
        base: 0,
        param: 0,
        trick: 0,
    }))

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
        member.forEach(({ affected, base }, j) => {
            const card = cards.get(team[i].card.id)!
            const bases = member.map(({ base }) => base)
            const panels = member.map(({ panel }) => panel)

            base +=
                applyCenter(guestCenter, card, bases, j) +
                applyCenter(center, card, bases, j)
            affected +=
                applyCenter(guestCenter, card, panels, j) +
                applyCenter(center, card, panels, j)

            results[j].base += base
            results[j].param += affected
            results[j].trick += affected * trickMultipliers[i][j]
        })
    )

    return results
}

function applyCenter(
    center: CenterSkill,
    card: Card,
    stats: number[],
    attribute: number
) {
    if (!center) return 0

    return (
        applyCenterEffect(
            center.main.type,
            center.main.value / 100,
            stats,
            attribute
        ) +
        (center.extra.apply && center.extra.type && center.extra.value
            ? (applyCenterApply(center.extra.apply, card) ? 1 : 0) *
              applyCenterEffect(
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

function applyCenterApply(
    type: CenterApplyType,
    { character, group, year, subunit }: Card
) {
    switch (type) {
        case CenterApplyType.FirstYear:
            return year === 1
        case CenterApplyType.SecondYear:
            return year === 2
        case CenterApplyType.ThirdYear:
            return year === 3
        case CenterApplyType.Muse:
            return group === Group.Muse
        case CenterApplyType.Aqours:
            return group === Group.Aqours
        case CenterApplyType.Printemps:
            return subunit === Subunit.Printemps
        case CenterApplyType.LilyWhite:
            return subunit === Subunit.LilyWhite
        case CenterApplyType.BiBi:
            return subunit === Subunit.BiBi
        case CenterApplyType.CYaRon:
            return subunit === Subunit.CYaRon
        case CenterApplyType.AZALEA:
            return subunit === Subunit.AZALEA
        case CenterApplyType.GuiltyKiss:
            return subunit === Subunit.GuiltyKiss
        case CenterApplyType.Nijigasaki:
            return group === Group.Nijigasaki
        case CenterApplyType.HonokaEli:
            return (
                character === CharacterId.Honoka ||
                character === CharacterId.Eli
            )
        case CenterApplyType.HonokaKotori:
            return (
                character === CharacterId.Honoka ||
                character === CharacterId.Kotori
            )
        case CenterApplyType.HonokaMaki:
            return (
                character === CharacterId.Honoka ||
                character === CharacterId.Maki
            )
        case CenterApplyType.HonokaHanayo:
            return (
                character === CharacterId.Honoka ||
                character === CharacterId.Hanayo
            )
        case CenterApplyType.HonokaNico:
            return (
                character === CharacterId.Honoka ||
                character === CharacterId.Nico
            )
        case CenterApplyType.EliUmi:
            return (
                character === CharacterId.Eli || character === CharacterId.Umi
            )
        case CenterApplyType.EliMaki:
            return (
                character === CharacterId.Eli || character === CharacterId.Maki
            )
        case CenterApplyType.EliNozomi:
            return (
                character === CharacterId.Eli ||
                character === CharacterId.Nozomi
            )
        case CenterApplyType.EliNico:
            return (
                character === CharacterId.Eli || character === CharacterId.Nico
            )
        case CenterApplyType.KotoriUmi:
            return (
                character === CharacterId.Kotori ||
                character === CharacterId.Umi
            )
        case CenterApplyType.KotoriRin:
            return (
                character === CharacterId.Kotori ||
                character === CharacterId.Rin
            )
        case CenterApplyType.KotoriMaki:
            return (
                character === CharacterId.Kotori ||
                character === CharacterId.Maki
            )
        case CenterApplyType.KotoriHanayo:
            return (
                character === CharacterId.Kotori ||
                character === CharacterId.Hanayo
            )
        case CenterApplyType.KotoriNico:
            return (
                character === CharacterId.Kotori ||
                character === CharacterId.Nico
            )
        case CenterApplyType.UmiRin:
            return (
                character === CharacterId.Umi || character === CharacterId.Rin
            )
        case CenterApplyType.UmiNozomi:
            return (
                character === CharacterId.Umi ||
                character === CharacterId.Nozomi
            )
        case CenterApplyType.UmiHanayo:
            return (
                character === CharacterId.Umi ||
                character === CharacterId.Hanayo
            )
        case CenterApplyType.RinMaki:
            return (
                character === CharacterId.Rin || character === CharacterId.Maki
            )
        case CenterApplyType.RinNozomi:
            return (
                character === CharacterId.Rin ||
                character === CharacterId.Nozomi
            )
        case CenterApplyType.RinHanayo:
            return (
                character === CharacterId.Rin ||
                character === CharacterId.Hanayo
            )
        case CenterApplyType.MakiHanayo:
            return (
                character === CharacterId.Maki ||
                character === CharacterId.Hanayo
            )
        case CenterApplyType.MakiNico:
            return (
                character === CharacterId.Maki || character === CharacterId.Nico
            )
        case CenterApplyType.NozomiHanayo:
            return (
                character === CharacterId.Nozomi ||
                character === CharacterId.Hanayo
            )
        case CenterApplyType.NozomiNico:
            return (
                character === CharacterId.Nozomi ||
                character === CharacterId.Nico
            )
        case CenterApplyType.HanayoNico:
            return (
                character === CharacterId.Hanayo ||
                character === CharacterId.Nico
            )
        case CenterApplyType.ChikaKanan:
            return (
                character === CharacterId.Chika ||
                character === CharacterId.Kanan
            )
        case CenterApplyType.ChikaYou:
            return (
                character === CharacterId.Chika || character === CharacterId.You
            )
        case CenterApplyType.ChikaYoshiko:
            return (
                character === CharacterId.Chika ||
                character === CharacterId.Yoshiko
            )
        case CenterApplyType.ChikaHanamaru:
            return (
                character === CharacterId.Chika ||
                character === CharacterId.Hanamaru
            )
        case CenterApplyType.ChikaMari:
            return (
                character === CharacterId.Chika ||
                character === CharacterId.Mari
            )
        case CenterApplyType.RikoKanan:
            return (
                character === CharacterId.Riko ||
                character === CharacterId.Kanan
            )
        case CenterApplyType.RikoDia:
            return (
                character === CharacterId.Riko || character === CharacterId.Dia
            )
        case CenterApplyType.RikoYou:
            return (
                character === CharacterId.Riko || character === CharacterId.You
            )
        case CenterApplyType.RikoYoshiko:
            return (
                character === CharacterId.Riko ||
                character === CharacterId.Yoshiko
            )
        case CenterApplyType.RikoHanamaru:
            return (
                character === CharacterId.Riko ||
                character === CharacterId.Hanamaru
            )
        case CenterApplyType.RikoMari:
            return (
                character === CharacterId.Riko || character === CharacterId.Mari
            )
        case CenterApplyType.KananDia:
            return (
                character === CharacterId.Kanan || character === CharacterId.Dia
            )
        case CenterApplyType.KananYou:
            return (
                character === CharacterId.Kanan || character === CharacterId.You
            )
        case CenterApplyType.KananMari:
            return (
                character === CharacterId.Kanan ||
                character === CharacterId.Mari
            )
        case CenterApplyType.KananRuby:
            return (
                character === CharacterId.Kanan ||
                character === CharacterId.Ruby
            )
        case CenterApplyType.DiaYou:
            return (
                character === CharacterId.Dia || character === CharacterId.You
            )
        case CenterApplyType.DiaYoshiko:
            return (
                character === CharacterId.Dia ||
                character === CharacterId.Yoshiko
            )
        case CenterApplyType.DiaMari:
            return (
                character === CharacterId.Dia || character === CharacterId.Mari
            )
        case CenterApplyType.DiaRuby:
            return (
                character === CharacterId.Dia || character === CharacterId.Ruby
            )
        case CenterApplyType.YouHanamaru:
            return (
                character === CharacterId.You ||
                character === CharacterId.Hanamaru
            )
        case CenterApplyType.YouMari:
            return (
                character === CharacterId.You || character === CharacterId.Mari
            )
        case CenterApplyType.YouRuby:
            return (
                character === CharacterId.You || character === CharacterId.Ruby
            )
        case CenterApplyType.YoshikoHanamaru:
            return (
                character === CharacterId.Yoshiko ||
                character === CharacterId.Hanamaru
            )
        case CenterApplyType.YoshikoRuby:
            return (
                character === CharacterId.Yoshiko ||
                character === CharacterId.Ruby
            )
        case CenterApplyType.HanamaruRuby:
            return (
                character === CharacterId.Hanamaru ||
                character === CharacterId.Ruby
            )
        case CenterApplyType.Liella:
            return group === Group.Liella
        default:
            throw `Unsupported center apply: ${CenterApplyType[type] || type}`
    }
}
