import { Live } from '../Live'

export type SpawnEvent = {
    time: number
    type: 'spawn'
}

export function processSpawnEvent(live: Live) {
    const triggers: [number][] = []

    live.context.noteTriggers.forEach(([i, count]) => {
        live.triggerCounters[i]++

        if (live.triggerCounters[i] < count) return
        live.triggerCounters[i] -= count

        triggers.push([i])
    })

    return triggers
}
