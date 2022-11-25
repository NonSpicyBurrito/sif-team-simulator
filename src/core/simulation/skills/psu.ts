import { Live } from '../Live'
import { setSelfCoverage } from './self-coverage'
import { doSkill } from './utils'

export function doPSU(live: Live, time: number, index: number, duration: number, value: number) {
    doSkill(live, time, index, (time, index) => {
        if (VITE_APP_DIAGNOSTICS) {
            live.context.log(
                time,
                'Member',
                index,
                'activates PSU',
                value,
                'until',
                time + duration
            )
        }

        live.psuState.add(time + duration, value)
        setSelfCoverage(live, time + duration, index)
    })
}
