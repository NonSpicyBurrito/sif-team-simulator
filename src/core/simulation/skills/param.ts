import { Live } from '../Live'
import { doSkill } from './utils'

export function doParam(
    this: Live,
    time: number,
    index: number,
    duration: number,
    value: number
) {
    doSkill(this, time, index, (time, index) => {
        if (this.paramState.value) return

        if (VITE_APP_DIAGNOSTICS) {
            this.context.log(
                'Member',
                index,
                'activates Param until',
                time + duration
            )
        }

        this.paramState.set(time + duration, value)
        this.setSelfCoverage(time + duration, index)
    })
}
