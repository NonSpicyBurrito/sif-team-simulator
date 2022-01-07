import { Live } from '../Live'

export type SpawnEvent = {
    time: number
    type: 'spawn'
}

export function processSpawnEvent(this: Live) {
    const triggers: [number][] = []

    this.context.noteTriggers.forEach(([i, count]) => {
        this.triggerCounters[i]++

        if (this.triggerCounters[i] < count) return
        this.triggerCounters[i] -= count

        triggers.push([i])
    })

    return triggers
}
