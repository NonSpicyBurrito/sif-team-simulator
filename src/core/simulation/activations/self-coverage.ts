import { Live } from '../Live'

export function activateSelfCoverage(this: Live, index: number) {
    const selfCoverage = this.selfCoverages[index]
    if (!selfCoverage) return false

    if (VITE_APP_DIAGNOSTICS) {
        this.context.log(
            'Member',
            index,
            'activates self coverage retrigger at',
            selfCoverage.endTime
        )
    }

    selfCoverage.retrigger = true
    return true
}
