import { Live } from '../Live'
import { getCFMultiplier } from '../skills/cf'
import { getComboMultiplier, getHeartBonus } from '../tap-score'

export type HitEvent = {
    time: number
    type: 'hit'
    position: number
    isSwing: boolean
    perfectJudgments: true[]
}

export function processHitEvent(this: Live, event: HitEvent) {
    const triggers: [number][] = []

    const isPlockActive = this.plockState.value > 0
    const paramMultiplier = this.paramState.value
    const psuBonus = this.psuState.value
    const cfBonus = this.cfState.value

    const baseJudgments = event.perfectJudgments.map(
        () => Math.random() < this.context.perfectRate
    )
    const judgments = isPlockActive ? event.perfectJudgments : baseJudgments

    const isPerfect = !judgments.includes(false)
    const plockMultiplier =
        isPlockActive && !baseJudgments.includes(false) ? 1.08 : 1
    const trickMultiplier = isPlockActive ? 1 : 0
    const heartMultiplier = 1 + this.hearts * getHeartBonus(this.context.maxHp)

    this.notes++
    this.combo++
    if (isPlockActive) this.covered++

    this.context.comboTriggers.forEach(([i, count]) => {
        this.triggerCounters[i]++

        if (this.triggerCounters[i] < count) return
        this.triggerCounters[i] -= count

        triggers.push([i])
    })

    if (isPerfect) {
        this.context.perfectTriggers.forEach(([i, count]) => {
            this.triggerCounters[i]++

            if (this.triggerCounters[i] < count) return
            this.triggerCounters[i] -= count

            triggers.push([i])
        })
    }

    const judgmentMultiplier = judgments.reduce(
        (acc, judgment) => acc * (judgment ? 1.25 : 1.1),
        1
    )
    const comboMultiplier = getComboMultiplier(this.combo)
    const groupMultiplier = this.context.groupMultipliers[event.position]
    const attributeMultiplier =
        this.context.attributeMultipliers[event.position]
    const noteMultiplier = event.isSwing ? 0.5 : 1
    const cfMultiplier = getCFMultiplier(this.combo)

    const totalStat =
        this.context.stat.base +
        this.context.stat.trick * trickMultiplier +
        this.context.stat.param * paramMultiplier

    this.score +=
        totalStat *
        0.01 *
        judgmentMultiplier *
        comboMultiplier *
        groupMultiplier *
        attributeMultiplier *
        noteMultiplier *
        plockMultiplier *
        heartMultiplier *
        this.context.tapScoreMultiplier

    if (isPerfect) this.score += psuBonus

    this.score += Math.min(1000, cfBonus * cfMultiplier)

    return triggers
}
