import { Live } from '../Live'
import { doSkill } from './utils'

export function doSpark(
    this: Live,
    time: number,
    index: number,
    count: number,
    duration: number,
    value: number
) {
    doSkill(this, time, index, (time, index) => {
        if (this.sparkState.value) return

        const multiplier = Math.floor(this.encoreActivated / count)
        this.encoreActivated -= multiplier * count

        const bonus = count * value * multiplier

        if (VITE_APP_DIAGNOSTICS) {
            this.context.log(
                time,
                'Member',
                index,
                'activates Spark',
                bonus,
                'until',
                time + duration
            )
        }

        this.sparkState.set(time + duration, bonus)
        this.setSelfCoverage(time + duration, index)
    })
}
