import { Live } from '../Live'
import { setSelfCoverage } from './self-coverage'
import { doSkill } from './utils'

export function doParam(live: Live, time: number, index: number, duration: number, value: number) {
    doSkill(live, time, index, (time, index) => {
        if (live.paramState.value) return

        if (VITE_APP_DIAGNOSTICS) {
            live.context.log(
                time,
                'Member',
                index,
                'activates Param',
                value,
                'until',
                time + duration
            )
        }

        live.paramState.set(time + duration, value)
        setSelfCoverage(live, time + duration, index)
    })
}
