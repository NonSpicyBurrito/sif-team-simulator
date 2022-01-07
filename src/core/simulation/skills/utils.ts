import { Live } from '../Live'

export function doSkill(
    live: Live,
    time: number,
    index: number,
    skill: (time: number, index: number) => void
) {
    live.tempLastSkill = live.tempLastSkill || skill
    skill(time, index)
}
