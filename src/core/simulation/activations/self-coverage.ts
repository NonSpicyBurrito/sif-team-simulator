import { Live } from '../Live'

export function activateSelfCoverage(live: Live, time: number, index: number) {
    const selfCoverage = live.selfCoverages[index]
    if (!selfCoverage) return false

    if (VITE_APP_DIAGNOSTICS) {
        live.context.log(
            time,
            'Member',
            index,
            'will activate self coverage retrigger at',
            selfCoverage.endTime
        )
    }

    selfCoverage.retrigger = true
    return true
}
