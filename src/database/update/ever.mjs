import axios from 'axios'
import { readFileSync, writeFileSync } from 'fs'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { extract } from './utils.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))

const path = `${__dirname}/../../../public/database/accessories.json`

const accessories = JSON.parse(readFileSync(path))

const data = await getData()

for (const accessory of data) {
    if (accessories[accessory.id]) continue

    try {
        const data = await getAccessoryData(
            accessory.index,
            accessory.effectType,
            accessory.character
        )
        accessories[accessory.id] = data
        console.log(accessory.id, data.character)
    } catch (error) {
        console.error(accessory.id, error)
    }
}

writeFileSync(path, JSON.stringify(accessories))

async function getData() {
    const html = (
        await axios.get('https://lab.everisay.xyz/sif/list/accessories.php', {
            responseType: 'text',
        })
    ).data

    const accessories = JSON.parse(extract(html, 'var accessories=', ';'))
    const cards = JSON.parse(extract(html, 'var cards=', ';'))

    return Object.entries(accessories)
        .map(([index, data]) => ({
            data,
            index,
        }))
        .filter(({ data }) => !!data && (data[4] === 4 || data[4] === 5))
        .map(({ data: [, , , id, , cardId, effectType], index }) => ({
            id,
            effectType,
            character: cards[cardId]?.[0] || 0,
            index,
        }))
}

async function getAccessoryData(index, effectType, character) {
    const data = Object.entries(
        (await axios.get(`https://lab.everisay.xyz/sif/interface/accessory.php?a=${index}`)).data
    )
        .sort(([a], [b]) => +a - +b)
        .map(([, value]) => value)

    return {
        character,
        stats: data.map(([smile, pure, cool]) => [smile, pure, cool]),
        skill: {
            trigger: {
                chances: data.map(([, , , , , chance]) => chance),
                values: data.map(([, , , , , , , value]) => value),
            },
            effect: {
                type: effectType,
                durations: data.map(([, , , , duration]) => duration),
                values: data.map(([, , , value]) => value),
            },
        },
    }
}
