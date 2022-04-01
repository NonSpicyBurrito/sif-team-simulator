import { Live } from '../Live'
import { setSelfCoverage } from './self-coverage'
import { doSkill } from './utils'

export function doPlock(
    live: Live,
    time: number,
    index: number,
    duration: number
) {
    doSkill(live, time, index, (time, index) => {
        if (VITE_APP_DIAGNOSTICS) {
            live.context.log(
                time,
                'Member',
                index,
                'activates Plock until',
                time + duration
            )
        }

        live.plockState.add(time + duration, 1)
        setSelfCoverage(live, time + duration, index)
    })
}
