import { activate } from './activations'
import { activateAccessorySkill } from './activations/accessory-skill'
import { activateCardSkill } from './activations/card-skill'
import { activateSelfCoverage } from './activations/self-coverage'
import { Context } from './Context'
import { processEvent } from './events'
import { processHitEvent } from './events/HitEvent'
import { processMissEvent } from './events/MissEvent'
import { processSpawnEvent } from './events/SpawnEvent'
import { processTimeSkillEvent } from './events/TimeSkillEvent'
import { consumeAmp, doAmp } from './skills/amp'
import { doCF } from './skills/cf'
import { doEncore } from './skills/encore'
import { doHeal } from './skills/heal'
import { doParam } from './skills/param'
import { doPlock } from './skills/plock'
import { doPSU } from './skills/psu'
import { doScore } from './skills/score'
import { setSelfCoverage } from './skills/self-coverage'
import { doSRU } from './skills/sru'
import { ExclusiveState } from './states/ExclusiveState'
import { StackedState } from './states/StackedState'
import { tickBuffs } from './tickers/buffs'
import { tickSelfCoverage } from './tickers/self-coverage'
import { tickSkills } from './tickers/skills'
import { fill } from './utils'

type SelfCoverage = {
    endTime: number
    retrigger: boolean
}

type LastSkill = (time: number, index: number) => void

export class Live {
    public readonly coinFlip = Math.random() < 0.5
    public readonly triggerCounters = fill(0)
    public readonly selfCoverages: (SelfCoverage | undefined)[] =
        fill(undefined)

    public notes = 0
    public combo = 0
    public covered = 0
    public score = 0
    public hearts = 0
    public overheal = 0

    public lastSkill: LastSkill | undefined
    public tempLastSkill: LastSkill | undefined

    public ampState = 0
    public tempAmp = 0

    public sruState = new ExclusiveState()
    public paramState = new ExclusiveState()

    public plockState = new StackedState()
    public psuState = new StackedState()
    public cfState = new StackedState()

    public processEvent = processEvent
    public processSpawnEvent = processSpawnEvent
    public processHitEvent = processHitEvent
    public processMissEvent = processMissEvent
    public processTimeSkillEvent = processTimeSkillEvent

    public tickSelfCoverage = tickSelfCoverage
    public tickBuffs = tickBuffs
    public tickSkills = tickSkills

    public activate = activate
    public activateSelfCoverage = activateSelfCoverage
    public activateCardSkill = activateCardSkill
    public activateAccessorySkill = activateAccessorySkill

    public doPlock = doPlock
    public doHeal = doHeal
    public doScore = doScore
    public doSRU = doSRU
    public doEncore = doEncore
    public doPSU = doPSU
    public doCF = doCF
    public doAmp = doAmp
    public doParam = doParam
    public consumeAmp = consumeAmp
    public setSelfCoverage = setSelfCoverage

    public constructor(public readonly context: Context) {
        if (VITE_APP_DIAGNOSTICS) {
            this.context.log('coinFlip', this.coinFlip)
        }
    }

    public simulate() {
        for (const event of this.context.events) {
            this.processEvent(event)
        }

        return {
            score: this.score,
            scorePerNote: this.score / this.notes,
            overhealHearts: this.hearts + this.overheal / this.context.maxHp,
            plockCoverage: this.covered / this.notes,
        }
    }
}
