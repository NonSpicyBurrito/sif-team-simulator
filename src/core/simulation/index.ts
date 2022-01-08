import { summarize } from '../presentation'
import { Team } from '../Team'
import { Context } from './Context'

export function simulateScore(
    team: Team,
    mode: string,
    memoryGalleryBonus: number[],
    guestCenter: number,
    chartId: string,
    perfectRate: number,
    noteSpeed: number,
    tapScoreBonus: number,
    skillChanceBonus: number,
    skillChanceReduction: number,
    count: number
) {
    const { results, diagnostics } = new Context(
        team,
        mode,
        memoryGalleryBonus,
        guestCenter,
        chartId,
        perfectRate,
        noteSpeed,
        tapScoreBonus,
        skillChanceBonus,
        skillChanceReduction,
        count === 1
    ).simulate(count)

    return {
        ...summarize(results),
        diagnostics,
    }
}
