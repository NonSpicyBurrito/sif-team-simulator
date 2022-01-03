import * as Axios from 'axios'
import { readFileSync, writeFileSync } from 'fs'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const axios = Axios.default

const cardsPath = `${__dirname}/../../../public/database/cards.json`
const charactersPath = `${__dirname}/../../../public/database/characters.json`

const cards = JSON.parse(readFileSync(cardsPath))
const characters = JSON.parse(readFileSync(charactersPath))

for (const id of await getCardIds()) {
    if (cards[id]) continue

    const [data, name] = await getCardData(id)

    cards[id] = data
    console.log(
        id,
        name,
        data.character,
        data.attribute,
        data.center,
        data.skill.trigger.type,
        data.skill.effect.type
    )

    characters[data.character] = name
}

writeFileSync(cardsPath, JSON.stringify(cards))
writeFileSync(charactersPath, JSON.stringify(characters))

async function getCardIds() {
    return (
        await axios.post(
            'https://sif.kirara.ca/api/ds/neo-search/cards/results.json',
            {
                rarity: [1, 2, 3, 5],
                max_smile: {
                    compare_type: 'gt',
                    compare_to: 1,
                },
                _sort: '+ordinal',
            }
        )
    ).data.result
}

async function getCardData(id) {
    const data = (
        await axios.get(`https://sif.kirara.ca/api/v1/card/${id}.json`)
    ).data.cards[0]

    return [
        {
            character: data.type_id,
            stats: [last(data.smile), last(data.pure), last(data.cool)],
            hp: data.hp_base,
            attribute: data.attribute - 1,
            center: data.center_skill.percent + data.center_skill.extra_percent,
            skill: {
                trigger: {
                    type: data.skill.trigger_type,
                    chances: data.skill.probability,
                    values: data.skill.trigger_val,
                },
                effect: {
                    type: data.skill.effect_type,
                    durations: data.skill.effect_dur,
                    values: data.skill.effect_val,
                },
            },
        },
        data.char_name,
    ]
}

function last(array) {
    return array[array.length - 1]
}
