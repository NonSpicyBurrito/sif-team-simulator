import { Chart, Difficulty } from '../database/Chart'

const attributeNames = ['Smile', 'Pure', 'Cool']

export function getChartDescription(chart: Chart) {
    return `${chart.title} [ ${Difficulty[chart.difficulty]} / ${
        attributeNames[chart.attribute]
    } / ${chart.notes.length} ]`
}
