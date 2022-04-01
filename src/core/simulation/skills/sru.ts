import { Live } from '../Live'
import { doSkill } from './utils'

export function doSRU(
    this: Live,
    time: number,
    index: number,
    duration: number,
    value: number
) {
    doSkill(this, time, index, (time, index) => {
        if (this.sruState.value) return

        if (VITE_APP_DIAGNOSTICS) {
            this.context.log(
                time,
                'Member',
                index,
                'activates SRU',
                value,
                'until',
                time + duration
            )
        }

        this.sruState.set(time + duration, value)
        this.setSelfCoverage(time + duration, index)
    })
}
