/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { toRaw } from 'vue'
import { accessories, cards, charts, sises } from '../../database'
import { CenterSkill } from '../../database/Center'
import { AccessorySkill, CardSkill, EffectType, TriggerType } from '../../database/Skill'
import { calculateTeamStat } from '../stats'
import { Team } from '../Team'
import { Event } from './events'
import { Live } from './Live'
import { normalize, Performance } from './performance'
import { getHeartBonus } from './tap-score'
import { fill } from './utils'

const missTiming = 0.256

type SkillInfo = {
    card: CardSkill
    accessory?: AccessorySkill
}

export class Context {
    public readonly skillInfos: SkillInfo[]
    public readonly stat: ReturnType<typeof calculateTeamStat>[number]
    public readonly noteCount: number
    public readonly groupMultipliers: number[]
    public readonly attributeMultipliers: number[]
    public readonly tapScoreMultiplier: number
    public readonly maxHp: number
    public readonly heartBonus: number
    public readonly maxHearts: number
    public readonly priorities: [number[], number[]]
    public readonly noteTriggers: [number, number][] = []
    public readonly comboTriggers: [number, number][] = []
    public readonly perfectTriggers: [number, number][] = []
    public readonly starPerfectTriggers: [number, number][] = []
    public readonly sisScoreMultipliers = fill(1)
    public readonly sisHealMultipliers = fill(0)
    public readonly events: Event[] = []
    public readonly skillChanceBonus: number
    public readonly skillChanceReduction: number
    public readonly getRandomJudgment: (note: number) => number

    private readonly diagnostics: [number | undefined, string][] | undefined

    public constructor(
        team: Team,
        mode: string,
        memoryGalleryBonus: number[],
        guestCenter: CenterSkill,
        chartId: string,
        performance: Performance,
        noteSpeed: number,
        tapScoreBonus: number,
        skillChanceBonus: number,
        skillChanceReduction: number,
        enableDiagnostics: boolean
    ) {
        if (mode !== 'normal' && mode !== 'afk') throw `Unsupported mode: ${mode}`

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
                    durations: processSkill(card.skill.effect.durations, cardSl),
                    values: processSkill(card.skill.effect.values, cardSl),
                },
            }

            if (!member.accessory) return { card: cardSkill }

            const accessory = accessories.get(member.accessory.id)!
            const accessorySl = member.accessory.level
            const accessorySkill = {
                trigger: {
                    chances: processSkill(accessory.skill.trigger.chances, accessorySl),
                    values: processSkill(accessory.skill.trigger.values, accessorySl),
                },
                effect: {
                    type: accessory.skill.effect.type,
                    durations: processSkill(accessory.skill.effect.durations, accessorySl),
                    values: processSkill(accessory.skill.effect.values, accessorySl),
                },
            }

            return {
                card: cardSkill,
                accessory: accessorySkill,
            }
        })

        const chart = charts.get(chartId)!
        this.stat = calculateTeamStat(team, memoryGalleryBonus, chartId, guestCenter)[
            chart.attribute
        ]
        this.noteCount = chart.notes.length
        const maxTime = Math.max(...chart.notes.map(({ endTime }) => endTime))
        const onScreenDuration = noteSpeed >= 6 ? 1.6 - noteSpeed * 0.1 : 1.9 - noteSpeed * 0.15

        this.groupMultipliers = team.map(({ card: { id } }) =>
            cards.get(id)!.group === chart.group ? 1.1 : 1
        )
        this.attributeMultipliers = team.map(({ card: { id } }) =>
            cards.get(id)!.attribute === chart.attribute ? 1.1 : 1
        )
        this.tapScoreMultiplier = 1 + tapScoreBonus
        this.maxHp = team.map(({ card: { id } }) => cards.get(id)!.hp).reduce((a, b) => a + b, 0)
        this.heartBonus = getHeartBonus(this.maxHp)
        this.maxHearts = Math.ceil(2 / this.heartBonus)

        this.priorities = [this.getPriorities(true), this.getPriorities(false)]

        this.skillInfos.forEach(({ card: { trigger } }, i) => {
            switch (trigger.type) {
                case TriggerType.Time:
                    for (let j = 1; j <= maxTime / trigger.values[0]; j++) {
                        this.events.push({
                            time: j * trigger.values[0],
                            type: 'timeSkill',
                            index: i,
                        })
                    }
                    break
                case TriggerType.Note:
                    this.noteTriggers.push([i, trigger.values[0]])
                    break
                case TriggerType.Combo:
                    this.comboTriggers.push([i, trigger.values[0]])
                    break
                case TriggerType.Perfect:
                    this.perfectTriggers.push([i, trigger.values[0]])
                    break
                case TriggerType.StarPerfect:
                    this.starPerfectTriggers.push([i, trigger.values[0]])
                    break
                default:
                    throw `Unsupported card trigger: ${TriggerType[trigger.type] || trigger.type}`
            }
        })

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

        chart.notes.forEach((note, index) => {
            this.events.push({
                time: note.startTime - onScreenDuration,
                type: 'spawn',
                note: index + 1,
            })
            switch (mode) {
                case 'normal':
                    this.events.push({
                        time: note.endTime,
                        type: 'hit',
                        note: index + 1,
                        position: note.position,
                        isStar: note.isStar,
                        isSwing: note.isSwing,
                        perfectJudgments: note.startTime === note.endTime ? [true] : [true, true],
                    })
                    break
                case 'afk':
                    this.events.push({
                        time: note.startTime + missTiming,
                        type: 'miss',
                        note: index + 1,
                    })
                    break
            }
        })
        this.events.sort((a, b) => a.time - b.time)

        this.skillChanceBonus = skillChanceBonus
        this.skillChanceReduction = skillChanceReduction

        const normalized = normalize(performance)
        const distribution = normalized.map((_, i) =>
            normalized.slice(0, i + 1).reduce((a, b) => a + b)
        )
        const overwrites = toRaw(performance.overwrites)
        this.getRandomJudgment = (note) => {
            const judgment = overwrites[note]
            if (judgment !== undefined) return judgment

            const value = Math.random()
            return distribution.findIndex((v) => v >= value)
        }

        this.diagnostics = enableDiagnostics ? [] : undefined

        if (VITE_APP_DIAGNOSTICS) {
            this.log(undefined, 'skillInfos', this.skillInfos)
            this.log(undefined, 'stat', this.stat)
            this.log(undefined, 'onScreenDuration', onScreenDuration)
            this.log(undefined, 'groupMultipliers', this.groupMultipliers)
            this.log(undefined, 'attributeMultipliers', this.attributeMultipliers)
            this.log(undefined, 'tapScoreMultiplier', this.tapScoreMultiplier)
            this.log(undefined, 'maxHp', this.maxHp)
            this.log(undefined, 'heartBonus', this.heartBonus)
            this.log(undefined, 'maxHearts', this.maxHearts)
            this.log(undefined, 'priorities', this.priorities)
            this.log(undefined, 'noteTriggers', this.noteTriggers)
            this.log(undefined, 'comboTriggers', this.comboTriggers)
            this.log(undefined, 'perfectTriggers', this.perfectTriggers)
            this.log(undefined, 'starPerfectTriggers', this.starPerfectTriggers)
            this.log(undefined, 'sisScoreMultipliers', this.sisScoreMultipliers)
            this.log(undefined, 'sisHealMultipliers', this.sisHealMultipliers)
        }
    }

    public simulate(count: number) {
        const results: ReturnType<Live['simulate']>[] = []

        for (let i = 0; i < count; i++) {
            results.push(new Live(this).simulate())
        }

        return {
            results,
            survivalRate:
                results.filter(({ survivedNotes }) => survivedNotes === this.noteCount).length /
                count,
            diagnostics: this.formattedDiagnostics,
        }
    }

    public log(time: number | undefined, ...args: unknown[]) {
        if (!this.diagnostics) return

        console.log(time, ...args)
        this.diagnostics.push([
            time,
            args
                .map((arg) => {
                    switch (typeof arg) {
                        case 'string':
                            return arg
                        case 'number':
                            return arg.toString()
                        default:
                            return JSON.stringify(arg, null, 2)
                    }
                })
                .join(' '),
        ])
    }

    private get formattedDiagnostics() {
        if (!this.diagnostics) return []

        let currentTime: number | undefined
        return this.diagnostics.map(([time, message]) => {
            if (time === undefined) {
                currentTime = time
                return message
            }

            const formattedTime = time.toFixed(3)
            if (time === currentTime) {
                return `${' '.repeat(formattedTime.length)}   ${message}`
            } else {
                currentTime = time
                return `${formattedTime} : ${message}`
            }
        })
    }

    private getPriorities(coinFlip: boolean) {
        return this.skillInfos.map((skillInfo, index) => {
            switch (skillInfo.card.effect.type) {
                case EffectType.Encore:
                    return 200 - index
                case EffectType.Amp:
                    return (coinFlip ? 1 : 0) * 100 - index
                default:
                    return (coinFlip ? 0 : 1) * 100 - index
            }
        })
    }
}

export function sortTriggers(triggers: [number, ...unknown[]][], priorities: number[]) {
    triggers.sort(([a], [b]) => priorities[a] - priorities[b])
}

function processSkill<T>(values: T[], level: number) {
    return values.concat(Array(16).fill(values[values.length - 1])).slice(level - 1)
}
