import { LastSkill, Live } from '../Live'

export function doSkill(live: Live, time: number, index: number, skill: LastSkill) {
    live.tempLastSkill = live.tempLastSkill || skill
    skill(time, index)
}
