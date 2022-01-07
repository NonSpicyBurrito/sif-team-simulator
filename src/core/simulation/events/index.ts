import { Live } from '../Live'
import { HitEvent } from './HitEvent'
import { SpawnEvent } from './SpawnEvent'

export function processEvent(this: Live, event: SpawnEvent | HitEvent) {
    this.tickSelfCoverage(event.time)

    if (VITE_APP_DIAGNOSTICS) {
        this.context.log('Event', event.type, 'at', event.time)
    }

    this.tickBuffs(event.time)

    let triggers: [number][]

    switch (event.type) {
        case 'spawn':
            triggers = this.processSpawnEvent()
            break
        case 'hit':
            triggers = this.processHitEvent(event)
            break
    }

    if (!triggers.length) return
    this.tickSkills(event.time, triggers)
}
