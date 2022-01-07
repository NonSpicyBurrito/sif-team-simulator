import { Live } from '../Live'

export function tickBuffs(this: Live, time: number) {
    this.sruState.update(time)
    this.paramState.update(time)

    this.plockState.update(time)
    this.psuState.update(time)
    this.cfState.update(time)
}
