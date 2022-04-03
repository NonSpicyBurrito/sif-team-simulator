import { Live } from '../Live'
import { doSkill } from './utils'

export function doAmp(live: Live, time: number, index: number, value: number) {
    doSkill(live, time, index, (time, index) => {
        if (live.tempAmp) return true

        if (VITE_APP_DIAGNOSTICS) {
            live.context.log(time, 'Member', index, 'activates Amp', value)
        }

        live.tempAmp = value
    })
}

export function consumeAmp(live: Live) {
    const temp = live.ampState
    live.ampState = 0
    return temp
}
