import { Live } from '../Live'

export function doEncore(live: Live, time: number, index: number) {
    const skill = live.tempLastSkill || live.lastSkill

    if (VITE_APP_DIAGNOSTICS) {
        if (skill) {
            live.context.log(time, 'Member', index, 'activates Encore')
        } else {
            live.context.log(
                time,
                'Member',
                index,
                'activates Encore but no skill to copy'
            )
        }
    }

    if (skill && !skill(time, index)) {
        live.sparkCharges++
        live.purgeLastSkill = true
    }

    if (VITE_APP_DIAGNOSTICS) {
        live.context.log(time, live.sparkCharges, 'Spark charges')
    }
}
