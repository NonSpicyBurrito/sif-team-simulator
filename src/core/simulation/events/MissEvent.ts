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

    return [] as [number][]
}
