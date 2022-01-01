/* eslint-disable no-inner-declarations */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { accessories, cards, charts, sises } from '../database'
import { EffectType, TriggerType } from '../database/Skill'
import { summarize } from './presentation'
import { calculateTeamStat } from './stats'
import { Team } from './Team'

type Event = {
    time: number
} & (
    | {
          type: 'spawn'
      }
    | {
          type: 'hit'
          position: number
          isSwing: boolean
          perfectJudgments: true[]
      }
)

class BuffState {
    public value = 0
    public endTime?: number

    public update(time: number) {
        if (this.endTime && time > this.endTime) {
            this.endTime = undefined
            this.value = 0
        }
    }

    public set(endTime: number, value: number) {
        this.endTime = endTime
        this.value = value
    }
}

class StackedBuffState {
    public value = 0

    private buffs: {
        endTime: number
        value: number
    }[] = []

    public update(time: number) {
        for (let i = this.buffs.length - 1; i >= 0; i--) {
            if (time <= this.buffs[i].endTime) continue

            this.value -= this.buffs[i].value
            this.buffs.splice(i, 1)
        }
    }

    public add(endTime: number, value: number) {
        this.value += value
        this.buffs.push({ endTime, value })
    }
}

type SelfCoverage = {
    endTime: number
    retrigger: boolean
}

export function simulateScore(
    team: Team,
    memoryGalleryBonus: number[],
    guestCenter: number,
    chartId: string,
    perfectRate: number,
    noteSpeed: number,
    tapScoreBonus: number,
    skillChanceBonus: number,
    count: number
) {
    const results: Record<'score' | 'hp' | 'coverage', number>[] = []

    const triggerTypes = new Set<TriggerType>()
    const effectTypes = new Set<EffectType>()

    const skillInfos = team.map((member) => {
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
        triggerTypes.add(card.skill.trigger.type)
        effectTypes.add(card.skill.effect.type)

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
        effectTypes.add(accessory.skill.effect.type)

        return {
            card: cardSkill,
            accessory: accessorySkill,
        }
    })

    if (triggerTypes.has(TriggerType.Time)) throw 'Unsupported trigger: Time'
    if (triggerTypes.has(TriggerType.Chain)) throw 'Unsupported trigger: Chain'
    if (effectTypes.has(EffectType.Sync)) throw 'Unsupported effect: Sync'

    const stat = calculateTeamStat(team, memoryGalleryBonus, guestCenter)
    const chart = charts.get(chartId)!
    const onScreenDuration =
        noteSpeed >= 6 ? 1.6 - noteSpeed * 0.1 : 1.9 - noteSpeed * 0.15

    const attributeMultipliers = team.map(({ card: { id } }) =>
        cards.get(id)!.attribute === chart.attribute ? 1.1 : 1
    )
    const tapScoreMultiplier = 1 + tapScoreBonus
    const maxHp = team
        .map(({ card: { id } }) => cards.get(id)!.hp)
        .reduce((a, b) => a + b, 0)

    const noteTriggers: [number, number][] = []
    const comboTriggers: [number, number][] = []
    const perfectTriggers: [number, number][] = []

    skillInfos.forEach(({ card }, i) => {
        switch (card.trigger.type) {
            case TriggerType.Note:
                noteTriggers.push([i, card.trigger.values[0]])
                break
            case TriggerType.Combo:
                comboTriggers.push([i, card.trigger.values[0]])
                break
            case TriggerType.Perfect:
                perfectTriggers.push([i, card.trigger.values[0]])
                break
        }
    })

    orderTriggers(noteTriggers, [2, 1, 0])
    orderTriggers(comboTriggers, [2, 1, 0])
    orderTriggers(perfectTriggers, [2, 1, 0])

    const sisScoreMultipliers = team.map(() => 1)
    const sisHealMultipliers = team.map(() => 0)

    team.forEach((member, i) =>
        member.sisNames.forEach((name) => {
            const sis = sises.get(name)!

            switch (sis.type) {
                case 'score':
                    sisScoreMultipliers[i] *= sis.value
                    break
                case 'heal':
                    sisHealMultipliers[i] += sis.value
                    break
            }
        })
    )

    const events: Event[] = []
    chart.notes.forEach((note) => {
        events.push({
            time: note.startTime - onScreenDuration,
            type: 'spawn',
        })
        events.push({
            time: note.endTime,
            type: 'hit',
            position: note.position,
            isSwing: note.isSwing,
            perfectJudgments:
                note.startTime === note.endTime ? [true] : [true, true],
        })
    })
    events.sort((a, b) => a.time - b.time)

    if (import.meta.env.DEV) {
        log('skillInfos', skillInfos)
        log('onScreenDuration', onScreenDuration)
        log('attributeMultipliers', attributeMultipliers)
        log('tapScoreMultiplier', tapScoreMultiplier)
        log('maxHp', maxHp)
        log('noteTriggers', noteTriggers)
        log('comboTriggers', comboTriggers)
        log('perfectTriggers', perfectTriggers)
        log('sisScoreMultipliers', sisScoreMultipliers)
        log('sisHealMultipliers', sisHealMultipliers)
    }

    for (let i = 0; i < count; i++) {
        const coinFlip = Math.random() < 0.5

        if (import.meta.env.DEV) {
            log('coinFlip', coinFlip)
        }

        const triggerCounters = team.map(() => 0)
        const selfCoverages: (SelfCoverage | undefined)[] = team.map(
            () => undefined
        )

        let notes = 0
        let combo = 0
        let covered = 0
        let score = 0
        let hearts = 0
        let overheal = 0

        let lastSkill: ((time: number, index: number) => void) | undefined
        let tempLastSkill: typeof lastSkill

        let ampState: number | undefined
        let tempAmp = 0

        const sruState = new BuffState()
        const paramState = new BuffState()

        const plockState = new StackedBuffState()
        const psuState = new StackedBuffState()
        const cfState = new StackedBuffState()

        for (const event of events) {
            sruState.update(event.time)
            paramState.update(event.time)

            plockState.update(event.time)
            psuState.update(event.time)
            cfState.update(event.time)

            const isPlockActive = plockState.value > 0
            const paramMultiplier = paramState.value
            const psuBonus = psuState.value
            const cfBonus = cfState.value
            const skillChanceMultiplier = 1 + skillChanceBonus + sruState.value

            if (import.meta.env.DEV) {
                log('Event', event.type, 'at', event.time)
            }

            tempLastSkill = undefined
            tempAmp = 0

            selfCoverages.forEach((selfCoverage, index) => {
                if (!selfCoverage) return

                if (event.time > selfCoverage.endTime) {
                    selfCoverages[index] = undefined

                    if (selfCoverage.retrigger) {
                        activateMemberSkill(selfCoverage.endTime, index)
                    }
                }
            })

            const triggers: [number][] = []

            switch (event.type) {
                case 'spawn': {
                    noteTriggers.forEach(([i, count]) => {
                        triggerCounters[i]++

                        if (triggerCounters[i] < count) return
                        triggerCounters[i] -= count

                        triggers.push([i])
                    })
                    break
                }
                case 'hit': {
                    const baseJudgments = event.perfectJudgments.map(
                        () => Math.random() < perfectRate
                    )
                    const judgments = isPlockActive
                        ? event.perfectJudgments
                        : baseJudgments

                    const isPerfect = !judgments.includes(false)
                    const plockMultiplier =
                        isPlockActive && !baseJudgments.includes(false)
                            ? 1.08
                            : 1
                    const trickMultiplier = isPlockActive ? 1 : 0
                    const heartMultiplier = 1 + hearts * getHeartBonus(maxHp)

                    notes++
                    combo++
                    if (isPlockActive) covered++

                    comboTriggers.forEach(([i, count]) => {
                        triggerCounters[i]++

                        if (triggerCounters[i] < count) return
                        triggerCounters[i] -= count

                        triggers.push([i])
                    })

                    if (isPerfect) {
                        perfectTriggers.forEach(([i, count]) => {
                            triggerCounters[i]++

                            if (triggerCounters[i] < count) return
                            triggerCounters[i] -= count

                            triggers.push([i])
                        })
                    }

                    const judgmentMultiplier = judgments.reduce(
                        (acc, judgment) => acc * (judgment ? 1.25 : 1.1),
                        1
                    )
                    const comboMultiplier = getComboMultiplier(combo)
                    const groupMultiplier = 1.1
                    const attributeMultiplier =
                        attributeMultipliers[event.position]
                    const noteMultiplier = event.isSwing ? 0.5 : 1
                    const cfMultiplier = getCFMultiplier(combo)

                    const totalStat =
                        stat.base +
                        stat.trick * trickMultiplier +
                        stat.param * paramMultiplier

                    score +=
                        totalStat *
                        0.01 *
                        judgmentMultiplier *
                        comboMultiplier *
                        groupMultiplier *
                        attributeMultiplier *
                        noteMultiplier *
                        plockMultiplier *
                        heartMultiplier *
                        tapScoreMultiplier

                    if (isPerfect) score += psuBonus

                    score += Math.min(1000, cfBonus * cfMultiplier)
                    break
                }
            }

            if (triggers.length) {
                if (coinFlip) {
                    let hasAmp = false
                    let hasEncore = false
                    let hasNormal = false

                    triggers.forEach(([i]) => {
                        switch (skillInfos[i].card.effect.type) {
                            case EffectType.Amp:
                                hasAmp = true
                                break
                            case EffectType.Encore:
                                hasEncore = true
                                break
                            default:
                                hasNormal = true
                                break
                        }
                    })

                    if (hasAmp && hasEncore && hasNormal) {
                        orderTriggers(triggers, [0, 1, 2])
                    }
                }

                triggers.forEach(([i]) => activateMemberSkill(event.time, i))
            }

            lastSkill = tempLastSkill || lastSkill

            if (!ampState && tempAmp) {
                if (import.meta.env.DEV) {
                    log('Amp', tempAmp, 'activates')
                }

                ampState = tempAmp
            }

            function activateMemberSkill(time: number, index: number) {
                const selfCoverage = selfCoverages[index]
                if (selfCoverage) {
                    selfCoverage.retrigger = true

                    if (import.meta.env.DEV) {
                        log(
                            'Member',
                            index,
                            'activates self coverage retrigger at',
                            selfCoverage.endTime
                        )
                    }
                    return
                }

                const { card, accessory } = skillInfos[index]

                if (import.meta.env.DEV) {
                    log(
                        'Attempts to activate member',
                        index,
                        'at',
                        event.time,
                        'with',
                        (card.trigger.chances[0] * skillChanceMultiplier) / 100,
                        'skill chance'
                    )
                }

                if (
                    Math.random() >=
                    (card.trigger.chances[0] * skillChanceMultiplier) / 100
                ) {
                    if (!accessory) return

                    log(
                        'Attempts to activate member',
                        index,
                        'at',
                        event.time,
                        'with',
                        (accessory.trigger.chances[0] * skillChanceMultiplier) /
                            100,
                        'accessory chance'
                    )

                    if (
                        Math.random() >=
                        (accessory.trigger.chances[0] * skillChanceMultiplier) /
                            100
                    )
                        return

                    const level = consumeAmp()

                    switch (accessory.effect.type) {
                        case EffectType.Plock:
                            doPlock(accessory.effect.durations[level])
                            break
                        case EffectType.Heal:
                            doHeal(accessory.effect.values[level])
                            break
                        case EffectType.SRU:
                            doSRU(
                                accessory.effect.durations[level],
                                accessory.effect.values[level] - 1
                            )
                            break
                        case EffectType.Encore:
                            doEncore()
                            break
                        case EffectType.PSU:
                            doPSU(
                                accessory.effect.durations[level],
                                accessory.effect.values[level]
                            )
                            break
                        case EffectType.CF:
                            doCF(
                                accessory.effect.durations[level],
                                accessory.effect.values[level]
                            )
                            break
                        case EffectType.Param:
                            doParam(
                                accessory.effect.durations[level],
                                accessory.effect.values[level] - 1
                            )
                            break
                    }
                    return
                }

                const level = consumeAmp()

                switch (card.effect.type) {
                    case EffectType.Plock:
                        doPlock(card.effect.durations[level])
                        break
                    case EffectType.Heal:
                        doHeal(card.effect.values[level])
                        break
                    case EffectType.Score:
                        doScore(card.effect.values[level])
                        break
                    case EffectType.SRU:
                        doSRU(
                            card.effect.durations[level],
                            card.effect.values[level] / 100
                        )
                        break
                    case EffectType.Encore:
                        doEncore()
                        break
                    case EffectType.PSU:
                        doPSU(
                            card.effect.durations[level],
                            card.effect.values[level]
                        )
                        break
                    case EffectType.CF:
                        doCF(
                            card.effect.durations[level],
                            card.effect.values[level]
                        )
                        break
                    case EffectType.Amp:
                        doAmp(card.effect.values[level])
                        break
                    case EffectType.Param:
                        doParam(
                            card.effect.durations[level],
                            card.effect.values[level] / 100
                        )
                        break
                }

                function doPlock(duration: number) {
                    doSkill((time, index) => {
                        if (import.meta.env.DEV) {
                            log(
                                'Member',
                                index,
                                'activates Plock until',
                                time + duration
                            )
                        }

                        plockState.add(time + duration, 1)
                        setSelfCoverage(time + duration, index)
                    })
                }

                function doHeal(value: number) {
                    const multiplier = sisHealMultipliers[index]

                    doSkill((time, index) => {
                        if (import.meta.env.DEV) {
                            log(
                                'Member',
                                index,
                                'heals',
                                value,
                                'scores',
                                value * multiplier
                            )
                        }

                        score += value * multiplier
                        overheal += value

                        if (overheal < maxHp) return
                        hearts++
                        overheal -= maxHp
                    })
                }

                function doScore(value: number) {
                    const multiplier = sisScoreMultipliers[index]

                    doSkill((time, index) => {
                        if (import.meta.env.DEV) {
                            log('Member', index, 'scores', value * multiplier)
                        }

                        score += value * multiplier
                    })
                }

                function doSRU(duration: number, value: number) {
                    doSkill((time, index) => {
                        if (sruState.endTime) return

                        if (import.meta.env.DEV) {
                            log(
                                'Member',
                                index,
                                'activates SRU',
                                value,
                                'until',
                                time + duration
                            )
                        }

                        sruState.set(time + duration, value)
                        setSelfCoverage(time + duration, index)
                    })
                }

                function doEncore() {
                    if (import.meta.env.DEV) {
                        if (tempLastSkill || lastSkill) {
                            log('Member', index, 'activates encore')
                        } else {
                            log(
                                'Member',
                                index,
                                'activates encore but no skill to copy'
                            )
                        }
                    }

                    ;(tempLastSkill || lastSkill)?.(time, index)

                    lastSkill = undefined
                }

                function doPSU(duration: number, value: number) {
                    doSkill((time, index) => {
                        if (import.meta.env.DEV) {
                            log(
                                'Member',
                                index,
                                'activates PSU',
                                value,
                                'until',
                                time + duration
                            )
                        }

                        psuState.add(time + duration, value)
                        setSelfCoverage(time + duration, index)
                    })
                }

                function doCF(duration: number, value: number) {
                    doSkill((time, index) => {
                        if (import.meta.env.DEV) {
                            log(
                                'Member',
                                index,
                                'activates CF',
                                value,
                                'until',
                                time + duration
                            )
                        }

                        cfState.add(time + duration, value)
                        setSelfCoverage(time + duration, index)
                    })
                }

                function doAmp(value: number) {
                    tempAmp = value
                    tempLastSkill = tempLastSkill || (() => doAmp(value))
                }

                function doParam(duration: number, value: number) {
                    doSkill((time, index) => {
                        if (paramState.endTime) return

                        if (import.meta.env.DEV) {
                            log(
                                'Member',
                                index,
                                'activates Param until',
                                time + duration
                            )
                        }

                        paramState.set(time + duration, value)
                        setSelfCoverage(time + duration, index)
                    })
                }

                function setSelfCoverage(endTime: number, index: number) {
                    selfCoverages[index] = { endTime, retrigger: false }
                }

                function doSkill(skill: (time: number, index: number) => void) {
                    tempLastSkill = tempLastSkill || skill
                    skill(time, index)
                }
            }

            function consumeAmp() {
                if (!ampState) return 0

                const temp = ampState
                ampState = undefined
                return temp
            }
        }

        results.push({
            score,
            hp: hearts + overheal / maxHp,
            coverage: covered / notes,
        })
    }

    return summarize(results)

    function orderTriggers(
        triggers: [number, ...unknown[]][],
        priorities: [number, number, number]
    ) {
        triggers.sort(([a], [b]) => getPriority(a) - getPriority(b))

        function getPriority(index: number) {
            switch (skillInfos[index].card.effect.type) {
                case EffectType.Amp:
                    return priorities[0] * 100 - index
                case EffectType.Encore:
                    return priorities[1] * 100 - index
                default:
                    return priorities[2] * 100 - index
            }
        }
    }

    function log(...args: unknown[]) {
        if (count === 1) console.log(...args)
    }
}

function processSkill<T>(values: T[], level: number) {
    return values
        .concat(Array(16).fill(values[values.length - 1]))
        .slice(level - 1)
}

function getComboMultiplier(combo: number) {
    return combo <= 50
        ? 1
        : combo <= 100
        ? 1.1
        : combo <= 200
        ? 1.15
        : combo <= 400
        ? 1.2
        : combo <= 600
        ? 1.25
        : combo <= 800
        ? 1.3
        : 1.35
}

function getHeartBonus(maxHp: number) {
    switch (maxHp) {
        case 9:
            return 0.0026
        case 10:
            return 0.0029
        case 11:
            return 0.0031
        case 12:
            return 0.0034
        case 13:
            return 0.0037
        case 14:
            return 0.004
        case 15:
            return 0.0043
        case 16:
            return 0.0046
        case 17:
            return 0.0049
        case 18:
            return 0.0051
        case 19:
            return 0.0059
        case 20:
            return 0.0063
        case 21:
            return 0.0066
        case 22:
            return 0.007
        case 23:
            return 0.0073
        case 24:
            return 0.0077
        case 25:
            return 0.008
        case 26:
            return 0.0084
        case 27:
            return 0.0088
        case 28:
            return 0.0091
        case 29:
            return 0.0095
        case 30:
            return 0.0099
        case 31:
            return 0.0102
        case 32:
            return 0.0106
        case 33:
            return 0.011
        case 34:
            return 0.0114
        case 35:
            return 0.0118
        case 36:
            return 0.0121
        case 37:
            return 0.0176
        case 38:
            return 0.0183
        case 39:
            return 0.019
        case 40:
            return 0.0197
        case 41:
            return 0.0204
        case 42:
            return 0.0211
        case 43:
            return 0.0218
        case 44:
            return 0.0225
        case 45:
            return 0.0233
        case 46:
            return 0.0264
        case 47:
            return 0.0273
        case 48:
            return 0.0282
        case 49:
            return 0.0291
        case 50:
            return 0.03
        case 51:
            return 0.0309
        case 52:
            return 0.0319
        case 53:
            return 0.0328
        case 54:
            return 0.0338
        case 55:
            return 0.0347
        case 56:
            return 0.0357
        case 57:
            return 0.0367
        case 58:
            return 0.0377
        case 59:
            return 0.0387
        case 60:
            return 0.0398
        case 61:
            return 0.0408
        case 62:
            return 0.0419
        case 63:
            return 0.0429
        default:
            throw `Unknown heart bonus for ${maxHp}`
    }
}

function getCFMultiplier(combo: number) {
    return combo <= 10
        ? 1
        : combo <= 20
        ? 1.1
        : combo <= 30
        ? 1.2
        : combo <= 40
        ? 1.3
        : combo <= 50
        ? 1.4
        : combo <= 60
        ? 1.5
        : combo <= 70
        ? 1.6
        : combo <= 80
        ? 1.7
        : combo <= 90
        ? 1.8
        : combo <= 100
        ? 1.9
        : combo <= 110
        ? 2
        : combo <= 120
        ? 2.25
        : combo <= 130
        ? 2.5
        : combo <= 140
        ? 2.75
        : combo <= 150
        ? 3
        : combo <= 160
        ? 3.5
        : combo <= 170
        ? 4
        : combo <= 180
        ? 5
        : combo <= 190
        ? 6
        : combo <= 200
        ? 7
        : combo <= 210
        ? 8
        : combo <= 220
        ? 9
        : 10
}
