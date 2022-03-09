import { Live } from '../Live'
import { doSkill } from './utils'

export function doPlock(
    this: Live,
    time: number,
    index: number,
    duration: number
) {
    doSkill(this, time, index, (time, index) => {
        if (VITE_APP_DIAGNOSTICS) {
            this.context.log(
                '⠀⠀⠀⠀⠀⠀⠀ Member',
                index,
                'activates Plock until',
                time + duration
            )
        }

        this.plockState.add(time + duration, 1)
        this.setSelfCoverage(time + duration, index)
    })
}
