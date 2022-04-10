import { Live } from '../Live'

export function tickBuffs(live: Live, time: number) {
    live.sruState.update(time)
    live.paramState.update(time)

    live.plockState.update(time)
    live.psuState.update(time)
    live.cfState.update(time)
    live.sparkState.update(time)
}
