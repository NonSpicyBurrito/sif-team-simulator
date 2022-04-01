import { Live } from '../Live'

export type TimeSkillEvent = {
    time: number
    type: 'timeSkill'
    index: number
}

export function processTimeSkillEvent(live: Live, event: TimeSkillEvent) {
    return [[event.index]] as [number][]
}
