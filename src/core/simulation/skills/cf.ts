import { Live } from '../Live'
import { setSelfCoverage } from './self-coverage'
import { doSkill } from './utils'

export function doCF(
    live: Live,
    time: number,
    index: number,
    duration: number,
    value: number
) {
    doSkill(live, time, index, (time, index) => {
        if (VITE_APP_DIAGNOSTICS) {
            live.context.log(
                time,
                'Member',
                index,
                'activates CF',
                value,
                'until',
                time + duration
            )
        }

        live.cfState.add(time + duration, value)
        setSelfCoverage(live, time + duration, index)
    })
}

export function getCFMultiplier(combo: number) {
    return combo <= 10
        ? 1
        : combo <= 20
        ? 1.1
        : combo <= 30
        ? 1.2
        : combo <= 40
        ? 1.3
        : combo <= 50
        ? 1.4
        : combo <= 60
        ? 1.5
        : combo <= 70
        ? 1.6
        : combo <= 80
        ? 1.7
        : combo <= 90
        ? 1.8
        : combo <= 100
        ? 1.9
        : combo <= 110
        ? 2
        : combo <= 120
        ? 2.25
        : combo <= 130
        ? 2.5
        : combo <= 140
        ? 2.75
        : combo <= 150
        ? 3
        : combo <= 160
        ? 3.5
        : combo <= 170
        ? 4
        : combo <= 180
        ? 5
        : combo <= 190
        ? 6
        : combo <= 200
        ? 7
        : combo <= 210
        ? 8
        : combo <= 220
        ? 9
        : 10
}
