import { Live } from '../Live'
import { setSelfCoverage } from './self-coverage'
import { doSkill } from './utils'

export function doSRU(live: Live, time: number, index: number, duration: number, value: number) {
    doSkill(live, time, index, (time, index) => {
        if (live.sruState.value) return

        if (VITE_APP_DIAGNOSTICS) {
            live.context.log(
                time,
                'Member',
                index,
                'activates SRU',
                value,
                'until',
                time + duration
            )
        }

        live.sruState.set(time + duration, value)
        setSelfCoverage(live, time + duration, index)
    })
}
