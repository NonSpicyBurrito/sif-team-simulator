import { Live } from '../Live'

export function activateSelfCoverage(live: Live, index: number) {
    const selfCoverage = live.selfCoverages[index]
    if (!selfCoverage) return false

    if (VITE_APP_DIAGNOSTICS) {
        live.context.log(
            selfCoverage.endTime,
            'Member',
            index,
            'activates self coverage retrigger'
        )
    }

    selfCoverage.retrigger = true
    return true
}
