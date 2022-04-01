import { Live } from '../Live'

export function setSelfCoverage(live: Live, endTime: number, index: number) {
    live.selfCoverages[index] = { endTime, retrigger: false }
}
