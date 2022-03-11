import { Live } from '../Live'
import { HitEvent } from './HitEvent'
import { MissEvent } from './MissEvent'
import { SpawnEvent } from './SpawnEvent'
import { TimeSkillEvent } from './TimeSkillEvent'

export type Event = SpawnEvent | HitEvent | MissEvent | TimeSkillEvent

export function processEvent(this: Live, event: Event) {
    this.tickSelfCoverage(event.time)

    if (VITE_APP_DIAGNOSTICS) {
        this.context.log(event.time.toFixed(4), ': Event', event.type)
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
        case 'miss':
            triggers = this.processMissEvent()
            break
        case 'timeSkill':
            triggers = this.processTimeSkillEvent(event)
            break
    }

    if (!triggers.length) return
    this.tickSkills(event.time, triggers)
}
