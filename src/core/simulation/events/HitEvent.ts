import { Live } from '../Live'
import { getCFMultiplier } from '../skills/cf'
import { getComboMultiplier, getHeartBonus } from '../tap-score'

export type HitEvent = {
    time: number
    type: 'hit'
    position: number
    isStar: boolean
    isSwing: boolean
    perfectJudgments: true[]
}

export function processHitEvent(live: Live, event: HitEvent) {
    const triggers: [number][] = []

    const isPlockActive = live.plockState.value > 0
    const paramMultiplier = live.paramState.value
    const sparkBonus = live.sparkState.value
    const psuBonus = live.psuState.value
    const cfBonus = live.cfState.value

    const baseJudgments = event.perfectJudgments.map(
        () => Math.random() < live.context.perfectRate
    )
    const judgments = isPlockActive ? event.perfectJudgments : baseJudgments

    const isPerfect = !judgments.includes(false)
    const plockMultiplier =
        isPlockActive && !baseJudgments.includes(false) ? 1.08 : 1
    const trickMultiplier = isPlockActive ? 1 : 0
    const heartMultiplier = 1 + live.hearts * getHeartBonus(live.context.maxHp)

    live.notes++
    live.combo++
    if (isPlockActive) live.covered++

    live.context.comboTriggers.forEach(([i, count]) => {
        live.triggerCounters[i]++

        if (live.triggerCounters[i] < count) return
        live.triggerCounters[i] -= count

        triggers.push([i])
    })

    if (isPerfect) {
        live.context.perfectTriggers.forEach(([i, count]) => {
            live.triggerCounters[i]++

            if (live.triggerCounters[i] < count) return
            live.triggerCounters[i] -= count

            triggers.push([i])
        })

        if (event.isStar) {
            live.context.starPerfectTriggers.forEach(([i, count]) => {
                live.triggerCounters[i]++

                if (live.triggerCounters[i] < count) return
                live.triggerCounters[i] -= count

                triggers.push([i])
            })
        }
    }

    const judgmentMultiplier = judgments.reduce(
        (acc, judgment) => acc * (judgment ? 1.25 : 1.1),
        1
    )
    const comboMultiplier = getComboMultiplier(live.combo)
    const groupMultiplier = live.context.groupMultipliers[event.position]
    const attributeMultiplier =
        live.context.attributeMultipliers[event.position]
    const noteMultiplier = event.isSwing ? 0.5 : 1
    const cfMultiplier = getCFMultiplier(live.combo)

    const totalStat =
        live.context.stat.base +
        live.context.stat.trick * trickMultiplier +
        live.context.stat.param * paramMultiplier

    live.score +=
        totalStat *
        0.01 *
        judgmentMultiplier *
        comboMultiplier *
        groupMultiplier *
        attributeMultiplier *
        noteMultiplier *
        plockMultiplier *
        heartMultiplier *
        live.context.tapScoreMultiplier

    live.score += sparkBonus

    if (isPerfect) live.score += psuBonus

    live.score += Math.min(1000, cfBonus * cfMultiplier)

    return triggers
}
