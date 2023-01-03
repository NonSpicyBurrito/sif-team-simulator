import { readFileSync, writeFileSync } from 'fs'
import fetch from 'node-fetch'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

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

    const data = await getChartData(id)
    chartsByDifficulty[difficulty][id] = data
    console.log(id, data.title, data.difficulty, data.attribute, data.notes.length)
}

for (const [difficulty, charts] of Object.entries(chartsByDifficulty)) {
    writeFileSync(`${pathBase}/${difficulty}.json`, JSON.stringify(charts))
}

async function getChartIds() {
    const html = await get('/live')

    const lives = JSON.parse(extract(html, 'var live = ', '\n'))

    const ids = []
    for (const { difficulties } of lives) {
        for (const difficulty of difficulties) {
            if (!difficulty.available) continue

            ids.push([difficulty.difficulty, difficulty.notes_setting_asset])
        }
    }

    return ids
}

async function getChartData(id) {
    const html = await get(`/live/${id}`)

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

async function get(url) {
    const response = await fetch(`https://card.llsif.moe${url}`, {
        headers: {
            'accept-encoding': 'gzip',
        },
    })
    return await response.text()
}

function extract(text, start, end, from) {
    const fromIndex = from ? text.indexOf(from) : 0
    const startIndex = text.indexOf(start, fromIndex) + start.length
    const endIndex = text.indexOf(end, startIndex)

    return text.slice(startIndex, endIndex)
}
