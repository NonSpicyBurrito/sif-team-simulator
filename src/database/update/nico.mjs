import * as Axios from 'axios'
import { readFileSync, writeFileSync } from 'fs'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { extract } from './utils.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const axios = Axios.default

const path = `${__dirname}/../../../public/database/charts.json`

const charts = JSON.parse(readFileSync(path))

for (const id of await getChartIds()) {
    if (charts[id]) continue

    const data = await getChartData(id)
    charts[id] = data
    console.log(
        id,
        data.title,
        data.difficulty,
        data.attribute,
        data.notes.length
    )
}

writeFileSync(path, JSON.stringify(charts))

async function getChartIds() {
    const html = (
        await axios.get('https://card.niconi.co.ni/live', {
            responseType: 'text',
        })
    ).data

    const lives = JSON.parse(extract(html, 'var live = ', '\n'))

    const ids = []
    lives.forEach(({ difficulties }) =>
        difficulties.forEach((diff) => {
            if (!diff.available) return
            if (diff.difficulty !== 6) return
            if (diff.ac_flag) return
            if (diff.five_keys_flag) return

            ids.push(diff.notes_setting_asset)
        })
    )

    return ids
}

async function getChartData(id) {
    const html = (
        await axios.get(`https://card.niconi.co.ni/live/${id}`, {
            responseType: 'text',
        })
    ).data

    const live = JSON.parse(extract(html, 'var lives = ', '\n'))[0]
    const notes = JSON.parse(live.notes_list)

    const title = live.keyword.split('\n').reverse()[0]

    return {
        title,
        difficulty: live.difficulty,
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
                        isSwing: false,
                    }
                case 3:
                case 13:
                    return {
                        startTime: note.timing_sec,
                        endTime: note.timing_sec + note.effect_value,
                        position: 9 - note.position,
                        isSwing: false,
                    }
                case 11:
                    return {
                        startTime: note.timing_sec,
                        endTime: note.timing_sec,
                        position: 9 - note.position,
                        isSwing: true,
                    }
            }
        }),
    }
}
