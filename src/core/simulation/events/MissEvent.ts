import { Live } from '../Live'

export type MissEvent = {
    time: number
    type: 'miss'
}

export function processMissEvent(this: Live) {
    const isPlockActive = this.plockState.value > 0

    this.notes++
    if (isPlockActive) this.covered++

    if (this.overheal > 0) {
        this.overheal = -2
    } else {
        this.overheal -= 2
    }

    if (
        this.survivedNotes === Number.POSITIVE_INFINITY &&
        this.context.maxHp + this.overheal <= 0
    ) {
        this.survivedNotes = this.notes - 1
    }

    return [] as [number][]
}
