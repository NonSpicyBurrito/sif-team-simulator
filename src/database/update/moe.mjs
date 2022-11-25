import axios from 'axios'
import { readFileSync, writeFileSync } from 'fs'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { extract } from './utils.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))

const pathBase = `${__dirname}/../../../public/database/charts`

const chartsByDifficulty = Object.fromEntries(
    [1, 2, 3, 4, 6].map((difficulty) => [
        difficulty,
        JSON.parse(readFileSync(`${pathBase}/${difficulty}.json`)),
    ])
)

for (const [difficulty, id] of await getChartIds()) {
    if (chartsByDifficulty[difficulty][id]) continue

    try {
        const data = await getChartData(id)
        chartsByDifficulty[difficulty][id] = data
        console.log(id, data.title, data.difficulty, data.attribute, data.notes.length)
    } catch (error) {
        console.error(id, error)
    }
}

Object.entries(chartsByDifficulty).forEach(([difficulty, charts]) =>
    writeFileSync(`${pathBase}/${difficulty}.json`, JSON.stringify(charts))
)

async function getChartIds() {
    const html = (
        await axios.get('https://card.llsif.moe/live', {
            headers: {
                'accept-encoding': 'gzip',
            },
            responseType: 'text',
        })
    ).data

    const lives = JSON.parse(extract(html, 'var live = ', '\n'))

    const ids = []
    lives.forEach(({ difficulties }) =>
        difficulties.forEach((diff) => {
            if (!diff.available) return

            ids.push([diff.difficulty, diff.notes_setting_asset])
        })
    )

    return ids
}

async function getChartData(id) {
    const html = (
        await axios.get(`https://card.llsif.moe/live/${id}`, {
            responseType: 'text',
        })
    ).data

    const live = JSON.parse(extract(html, 'var lives = ', '\n'))[0]
    const notes = JSON.parse(live.notes_list)

    const title = live.keyword.split('\n').reverse()[0]

    return {
        title,
        difficulty: live.difficulty,
        group: live.member_category,
        attribute: notes[0].notes_attribute - 1,
        notes: notes.map((note) => {
            switch (note.effect) {
                case 1:
                case 2:
                case 4:
                    return {
                        startTime: note.timing_sec,
                        endTime: note.timing_sec,
                        position: 9 - note.position,
                        isStar: note.effect === 4,
                        isSwing: false,
                    }
                case 3:
                case 13:
                    return {
                        startTime: note.timing_sec,
                        endTime: note.timing_sec + note.effect_value,
                        position: 9 - note.position,
                        isStar: false,
                        isSwing: false,
                    }
                case 11:
                    return {
                        startTime: note.timing_sec,
                        endTime: note.timing_sec,
                        position: 9 - note.position,
                        isStar: false,
                        isSwing: true,
                    }
            }
        }),
    }
}
