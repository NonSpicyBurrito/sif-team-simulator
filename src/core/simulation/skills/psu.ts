import { Live } from '../Live'
import { doSkill } from './utils'

export function doPSU(
    this: Live,
    time: number,
    index: number,
    duration: number,
    value: number
) {
    doSkill(this, time, index, (time, index) => {
        if (VITE_APP_DIAGNOSTICS) {
            this.context.log(
                'Member',
                index,
                'activates PSU',
                value,
                'until',
                time + duration
            )
        }

        this.psuState.add(time + duration, value)
        this.setSelfCoverage(time + duration, index)
    })
}
