import { Live } from '../Live'

export type MissEvent = {
    time: number
    type: 'miss'
    note: number
}

export function processMissEvent(live: Live) {
    const isPlockActive = live.plockState.value > 0

    live.notes++
    if (isPlockActive) live.covered++

    live.decreaseHp(2)

    if (
        live.survivedNotes === Number.POSITIVE_INFINITY &&
        live.context.maxHp + live.overheal <= 0
    ) {
        live.survivedNotes = live.notes - 1
    }

    return [] as [number][]
}
