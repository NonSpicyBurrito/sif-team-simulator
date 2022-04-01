import { Live } from '../Live'
import { tickBuffs } from '../tickers/buffs'
import { tickSelfCoverage } from '../tickers/self-coverage'
import { tickSkills } from '../tickers/skills'
import { HitEvent, processHitEvent } from './HitEvent'
import { MissEvent, processMissEvent } from './MissEvent'
import { processSpawnEvent, SpawnEvent } from './SpawnEvent'
import { processTimeSkillEvent, TimeSkillEvent } from './TimeSkillEvent'

export type Event = SpawnEvent | HitEvent | MissEvent | TimeSkillEvent

export function processEvent(live: Live, event: Event) {
    tickSelfCoverage(live, event.time)

    if (VITE_APP_DIAGNOSTICS) {
        const args = [event.time, 'Event', event.type]
        if ('note' in event) args.push('for note', event.note)

        live.context.log(event.time, ...args)
    }

    tickBuffs(live, event.time)

    let triggers: [number][]

    switch (event.type) {
        case 'spawn':
            triggers = processSpawnEvent(live)
            break
        case 'hit':
            triggers = processHitEvent(live, event)
            break
        case 'miss':
            triggers = processMissEvent(live)
            break
        case 'timeSkill':
            triggers = processTimeSkillEvent(live, event)
            break
    }

    if (!triggers.length) return
    tickSkills(live, event.time, triggers)
}
