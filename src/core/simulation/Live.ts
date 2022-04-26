import { Context } from './Context'
import { processEvent } from './events'
import { ExclusiveState } from './states/ExclusiveState'
import { StackedState } from './states/StackedState'
import { fill } from './utils'

type SelfCoverage = {
    endTime: number
    retrigger: boolean
}

export type LastSkill = (time: number, index: number) => true | void

export class Live {
    public readonly coinFlip = Math.random() < 0.5
    public readonly triggerCounters = fill(0)
    public readonly selfCoverages: (SelfCoverage | undefined)[] =
        fill(undefined)

    public notes = 0
    public combo = 0
    public covered = 0
    public score = 0
    public hearts = 0
    public overheal = 0
    public survivedNotes = Number.POSITIVE_INFINITY

    public purgeLastSkill = false
    public lastSkill: LastSkill | undefined
    public tempLastSkill: LastSkill | undefined

    public ampState = 0
    public tempAmp = 0

    public sparkCharges = 0

    public sruState = new ExclusiveState()
    public paramState = new ExclusiveState()

    public plockState = new StackedState()
    public psuState = new StackedState()
    public cfState = new StackedState()
    public sparkState = new StackedState()

    public constructor(public readonly context: Context) {
        if (VITE_APP_DIAGNOSTICS) {
            this.context.log(undefined, 'coinFlip', this.coinFlip)
        }
    }

    public simulate() {
        for (const event of this.context.events) {
            processEvent(this, event)
        }

        return {
            score: this.score,
            scorePerNote: this.score / this.notes,
            overhealHearts: this.hearts + this.overheal / this.context.maxHp,
            plockCoverage: this.covered / this.notes,
            survivedNotes:
                this.survivedNotes === Number.POSITIVE_INFINITY
                    ? this.notes
                    : this.survivedNotes,
        }
    }

    public increaseHp(value: number) {
        this.overheal += value

        if (this.overheal < this.context.maxHp) return
        this.hearts++
        this.overheal -= this.context.maxHp
    }

    public decreaseHp(value: number) {
        if (this.overheal > 0) {
            this.overheal = -value
        } else {
            this.overheal -= value
        }
    }
}
