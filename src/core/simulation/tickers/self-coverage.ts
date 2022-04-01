import { Live } from '../Live'
import { tickBuffs } from './buffs'
import { tickSkills } from './skills'

export function tickSelfCoverage(live: Live, time: number) {
    const triggersByTime = new Map<number, [number][]>()

    live.selfCoverages.forEach((selfCoverage, index) => {
        if (!selfCoverage) return
        if (selfCoverage.endTime > time) return

        live.selfCoverages[index] = undefined

        if (!selfCoverage.retrigger) return

        const triggers = triggersByTime.get(selfCoverage.endTime) || []
        triggers.push([index])
        triggersByTime.set(selfCoverage.endTime, triggers)
    })

    if (!triggersByTime.size) return
    ;[...triggersByTime.entries()]
        .sort(([a], [b]) => a - b)
        .forEach(([time, triggers]) => {
            tickBuffs(live, time)
            tickSkills(live, time, triggers)
        })
}
