import { Chart } from '../database/Chart'

const difficultyNames = { 6: 'Master' } as Record<number, string>
const attributeNames = ['Smile', 'Pure', 'Cool']

export function getChartDescription(chart: Chart) {
    return `${chart.title} [ ${difficultyNames[chart.difficulty]} / ${
        attributeNames[chart.attribute]
    } / ${chart.notes.length} ]`
}
