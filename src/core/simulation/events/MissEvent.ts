import { Live } from '../Live'

export type MissEvent = {
    time: number
    type: 'miss'
}

export function processMissEvent(this: Live) {
    const isPlockActive = this.plockState.value > 0

    this.notes++
    if (isPlockActive) this.covered++

    this.overheal -= 2

    return [] as [number][]
}
