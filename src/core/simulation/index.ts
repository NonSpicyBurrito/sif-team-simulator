import { CenterSkill } from '../../database/Center'
import { summarize } from '../presentation'
import { Team } from '../Team'
import { Context } from './Context'
import { Performance } from './performance'

export function simulateScore(
    team: Team,
    mode: string,
    memoryGalleryBonus: number[],
    guestCenter: CenterSkill,
    chartId: string,
    performance: Performance,
    noteSpeed: number,
    tapScoreBonus: number,
    skillChanceBonus: number,
    skillChanceReduction: number,
    count: number
) {
    const { results, survivalRate, diagnostics } = new Context(
        team,
        mode,
        memoryGalleryBonus,
        guestCenter,
        chartId,
        performance,
        noteSpeed,
        tapScoreBonus,
        skillChanceBonus,
        skillChanceReduction,
        count === 1
    ).simulate(count)

    return {
        raw: results,
        ...summarize(results),
        survivalRate,
        diagnostics,
    }
}
