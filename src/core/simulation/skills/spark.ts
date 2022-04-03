import { Live } from '../Live'
import { setSelfCoverage } from './self-coverage'
import { doSkill } from './utils'

export function doSpark(
    live: Live,
    time: number,
    index: number,
    count: number,
    duration: number,
    value: number
) {
    doSkill(live, time, index, (time, index) => {
        const multiplier = Math.floor(live.sparkCharges / count)
        live.sparkCharges -= multiplier * count

        const bonus = count * value * multiplier

        if (VITE_APP_DIAGNOSTICS) {
            live.context.log(
                time,
                'Member',
                index,
                'activates Spark',
                bonus,
                'until',
                time + duration
            )
        }

        live.sparkState.add(time + duration, bonus)
        setSelfCoverage(live, time + duration, index)
    })
}
