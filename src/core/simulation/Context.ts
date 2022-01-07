/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { accessories, cards, charts, sises } from '../../database'
import {
    AccessorySkill,
    CardSkill,
    EffectType,
    TriggerType,
} from '../../database/Skill'
import { calculateTeamStat } from '../stats'
import { Team } from '../Team'
import { HitEvent } from './events/HitEvent'
import { SpawnEvent } from './events/SpawnEvent'
import { Live } from './Live'
import { fill } from './utils'

type SkillInfo = {
    card: CardSkill
    accessory?: AccessorySkill
}

export class Context {
    public readonly skillInfos: SkillInfo[]
    public readonly stat: ReturnType<typeof calculateTeamStat>
    public readonly noteCount: number
    public readonly attributeMultipliers: number[]
    public readonly tapScoreMultiplier: number
    public readonly maxHp: number
    public readonly noteTriggers: [number, number][] = []
    public readonly comboTriggers: [number, number][] = []
    public readonly perfectTriggers: [number, number][] = []
    public readonly sisScoreMultipliers = fill(1)
    public readonly sisHealMultipliers = fill(0)
    public readonly events: (SpawnEvent | HitEvent)[] = []
    public readonly perfectRate: number
    public readonly skillChanceBonus: number
    public readonly skillChanceReduction: number

    private readonly diagnostics: string[] | undefined

    public constructor(
        team: Team,
        memoryGalleryBonus: number[],
        guestCenter: number,
        chartId: string,
        perfectRate: number,
        noteSpeed: number,
        tapScoreBonus: number,
        skillChanceBonus: number,
        skillChanceReduction: number,
        enableDiagnostics: boolean
    ) {
        this.skillInfos = team.map((member) => {
            const card = cards.get(member.card.id)!
            const cardSl = member.card.sl
            const cardSkill = {
                trigger: {
                    type: card.skill.trigger.type,
                    chances: processSkill(card.skill.trigger.chances, cardSl),
                    values: processSkill(card.skill.trigger.values, cardSl),
                },
                effect: {
                    type: card.skill.effect.type,
                    durations: processSkill(
                        card.skill.effect.durations,
                        cardSl
                    ),
                    values: processSkill(card.skill.effect.values, cardSl),
                },
            }

            if (!member.accessory) return { card: cardSkill }

            const accessory = accessories.get(member.accessory.id)!
            const accessorySl = member.accessory.level
            const accessorySkill = {
                trigger: {
                    chances: processSkill(
                        accessory.skill.trigger.chances,
                        accessorySl
                    ),
                },
                effect: {
                    type: accessory.skill.effect.type,
                    durations: processSkill(
                        accessory.skill.effect.durations,
                        accessorySl
                    ),
                    values: processSkill(
                        accessory.skill.effect.values,
                        accessorySl
                    ),
                },
            }

            return {
                card: cardSkill,
                accessory: accessorySkill,
            }
        })

        this.stat = calculateTeamStat(team, memoryGalleryBonus, guestCenter)
        const chart = charts.get(chartId)!
        const onScreenDuration =
            noteSpeed >= 6 ? 1.6 - noteSpeed * 0.1 : 1.9 - noteSpeed * 0.15

        this.noteCount = chart.notes.length
        this.attributeMultipliers = team.map(({ card: { id } }) =>
            cards.get(id)!.attribute === chart.attribute ? 1.1 : 1
        )
        this.tapScoreMultiplier = 1 + tapScoreBonus
        this.maxHp = team
            .map(({ card: { id } }) => cards.get(id)!.hp)
            .reduce((a, b) => a + b, 0)

        this.skillInfos.forEach(({ card }, i) => {
            switch (card.trigger.type) {
                case TriggerType.Note:
                    this.noteTriggers.push([i, card.trigger.values[0]])
                    break
                case TriggerType.Combo:
                    this.comboTriggers.push([i, card.trigger.values[0]])
                    break
                case TriggerType.Perfect:
                    this.perfectTriggers.push([i, card.trigger.values[0]])
                    break
                default:
                    throw `Unsupported card trigger: ${
                        TriggerType[card.trigger.type]
                    }`
            }
        })

        this.sortTriggers(this.noteTriggers, [2, 1, 0])
        this.sortTriggers(this.comboTriggers, [2, 1, 0])
        this.sortTriggers(this.perfectTriggers, [2, 1, 0])

        team.forEach((member, i) =>
            member.sisNames.forEach((name) => {
                const sis = sises.get(name)!

                switch (sis.type) {
                    case 'score':
                        this.sisScoreMultipliers[i] *= sis.value
                        break
                    case 'heal':
                        this.sisHealMultipliers[i] += sis.value
                        break
                }
            })
        )

        chart.notes.forEach((note) => {
            this.events.push({
                time: note.startTime - onScreenDuration,
                type: 'spawn',
            })
            this.events.push({
                time: note.endTime,
                type: 'hit',
                position: note.position,
                isSwing: note.isSwing,
                perfectJudgments:
                    note.startTime === note.endTime ? [true] : [true, true],
            })
        })
        this.events.sort((a, b) => a.time - b.time)

        this.perfectRate = perfectRate
        this.skillChanceBonus = skillChanceBonus
        this.skillChanceReduction = skillChanceReduction

        this.diagnostics = enableDiagnostics ? [] : undefined

        if (VITE_APP_DIAGNOSTICS) {
            this.log('skillInfos', this.skillInfos)
            this.log('onScreenDuration', onScreenDuration)
            this.log('attributeMultipliers', this.attributeMultipliers)
            this.log('tapScoreMultiplier', this.tapScoreMultiplier)
            this.log('maxHp', this.maxHp)
            this.log('noteTriggers', this.noteTriggers)
            this.log('comboTriggers', this.comboTriggers)
            this.log('perfectTriggers', this.perfectTriggers)
            this.log('sisScoreMultipliers', this.sisScoreMultipliers)
            this.log('sisHealMultipliers', this.sisHealMultipliers)
        }
    }

    public simulate(count: number) {
        const results: ReturnType<Live['simulate']>[] = []

        for (let i = 0; i < count; i++) {
            results.push(new Live(this).simulate())
        }

        return {
            results,
            diagnostics: this.diagnostics || [],
        }
    }

    public sortTriggers(
        triggers: [number, ...unknown[]][],
        priorities: [number, number, number]
    ) {
        triggers.sort(
            ([a], [b]) =>
                this.getPriority(a, priorities) -
                this.getPriority(b, priorities)
        )
    }

    public getPriority(index: number, priorities: [number, number, number]) {
        switch (this.skillInfos[index].card.effect.type) {
            case EffectType.Amp:
                return priorities[0] * 100 - index
            case EffectType.Encore:
                return priorities[1] * 100 - index
            default:
                return priorities[2] * 100 - index
        }
    }

    public log(...args: unknown[]) {
        if (!this.diagnostics) return

        console.log(...args)
        this.diagnostics.push(
            args
                .map((arg) => {
                    switch (typeof arg) {
                        case 'string':
                            return arg
                        case 'number':
                            return arg.toString()
                        default:
                            return JSON.stringify(arg, null, 1)
                    }
                })
                .join(' ')
        )
    }
}

function processSkill<T>(values: T[], level: number) {
    return values
        .concat(Array(16).fill(values[values.length - 1]))
        .slice(level - 1)
}
