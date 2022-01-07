import { Live } from '../Live'

export function setSelfCoverage(this: Live, endTime: number, index: number) {
    this.selfCoverages[index] = { endTime, retrigger: false }
}
