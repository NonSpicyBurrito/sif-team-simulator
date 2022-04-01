import { Live } from '../Live'

export function doEncore(this: Live, time: number, index: number) {
    const skill = this.tempLastSkill || this.lastSkill

    if (VITE_APP_DIAGNOSTICS) {
        if (skill) {
            this.context.log(time, 'Member', index, 'activates encore')
        } else {
            this.context.log(
                time,
                'Member',
                index,
                'activates encore but no skill to copy'
            )
        }
    }

    if (skill) {
        this.encoreActivated++
        skill(time, index)
    }

    this.purgeLastSkill = true
}
