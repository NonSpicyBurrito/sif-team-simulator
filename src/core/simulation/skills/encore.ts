import { Live } from '../Live'

export function doEncore(live: Live, time: number, index: number) {
    const skill = live.tempLastSkill || live.lastSkill

    if (VITE_APP_DIAGNOSTICS) {
        if (skill) {
            live.context.log(time, 'Member', index, 'activates encore')
        } else {
            live.context.log(
                time,
                'Member',
                index,
                'activates encore but no skill to copy'
            )
        }
    }

    if (skill) {
        live.encoreActivated++
        skill(time, index)
    }

    if (VITE_APP_DIAGNOSTICS) {
        live.context.log(time, live.encoreActivated, 'encore charges')
    }

    live.purgeLastSkill = true
}
