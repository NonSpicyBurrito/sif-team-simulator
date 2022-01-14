import { Live } from '../Live'

export function tickSelfCoverage(this: Live, time: number) {
    const triggersByTime = new Map<number, [number][]>()

    this.selfCoverages.forEach((selfCoverage, index) => {
        if (!selfCoverage) return
        if (selfCoverage.endTime > time) return

        this.selfCoverages[index] = undefined

        if (!selfCoverage.retrigger) return

        const triggers = triggersByTime.get(selfCoverage.endTime) || []
        triggers.push([index])
        triggersByTime.set(selfCoverage.endTime, triggers)
    })

    if (!triggersByTime.size) return
    ;[...triggersByTime.entries()]
        .sort(([a], [b]) => a - b)
        .forEach(([time, triggers]) => {
            this.tickBuffs(time)
            this.tickSkills(time, triggers)
        })
}
