import { Live } from '../Live'

export function doAmp(live: Live, value: number) {
    live.tempAmp = value
    live.tempLastSkill = live.tempLastSkill || (() => doAmp(live, value))
}

export function consumeAmp(live: Live) {
    const temp = live.ampState
    live.ampState = 0
    return temp
}
