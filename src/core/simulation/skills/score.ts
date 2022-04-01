import { Live } from '../Live'
import { doSkill } from './utils'

export function doScore(
    live: Live,
    time: number,
    index: number,
    value: number
) {
    const multiplier = live.context.sisScoreMultipliers[index]

    doSkill(live, time, index, (time, index) => {
        if (VITE_APP_DIAGNOSTICS) {
            live.context.log(
                time,
                'Member',
                index,
                'scores',
                value * multiplier
            )
        }

        live.score += value * multiplier
    })
}
