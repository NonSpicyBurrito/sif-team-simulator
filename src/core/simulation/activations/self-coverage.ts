import { Live } from '../Live'

export function activateSelfCoverage(this: Live, index: number) {
    const selfCoverage = this.selfCoverages[index]
    if (!selfCoverage) return false

    if (VITE_APP_DIAGNOSTICS) {
        this.context.log(
            selfCoverage.endTime.toFixed(4),
            ': Member',
            index,
            'activates self coverage retrigger'
        )
    }

    selfCoverage.retrigger = true
    return true
}
