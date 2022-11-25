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

const ids = (await getCardIds()).filter((id) => !cards[id])
const chunks = split(ids, 1000)

for (const chunk of chunks) {
    try {
        ;(await getCardsData(chunk)).forEach(([id, data, name]) => {
            cards[id] = data
            console.log(
                id,
                name,
                data.character,
                data.group,
                data.year,
                data.subunit,
                data.rarity,
                data.attribute,
                data.center.main.type,
                data.center.extra.type,
                data.skill.trigger.type,
                data.skill.effect.type
            )

            characters[data.character] = name
        })
    } catch (error) {
        console.error(error)
    }
}

writeFileSync(cardsPath, JSON.stringify(cards))
writeFileSync(charactersPath, JSON.stringify(characters))

async function getCardIds() {
    return (
        await axios.post('https://sif.kirara.ca/api/ds/neo-search/cards/results.json', {
            rarity: [1],
            max_smile: {
                compare_type: 'gt',
                compare_to: 1,
            },
            _sort: '+ordinal',
        })
    ).data.result
}

function split(array, size) {
    return [...Array(Math.ceil(array.length / size))].map((_, i) =>
        array.slice(i * size, i * size + size)
    )
}

async function getCardsData(ids) {
    const cards = (await axios.get(`https://sif.kirara.ca/api/v1/card/${ids.join(',')}.json`)).data
        .cards

    return cards.map((card) => [
        card.ordinal,
        {
            character: card.type_id,
            group: card.affiliation,
            year: card.year,
            subunit: card.sub_affiliation,
            rarity: card.rarity,
            stats: [last(card.smile), last(card.pure), last(card.cool)],
            hp: card.hp_base,
            attribute: card.attribute - 1,
            center: {
                main: {
                    type: card.center_skill.effect_type,
                    value: card.center_skill.percent,
                },
                extra: {
                    apply: card.center_skill.extra_apply_type || undefined,
                    type: card.center_skill.extra_effect || undefined,
                    value: card.center_skill.extra_percent || undefined,
                },
            },
            skill: {
                trigger: {
                    type: card.skill.trigger_type,
                    chances: card.skill.probability,
                    values: card.skill.trigger_val,
                },
                effect: {
                    type: card.skill.effect_type,
                    durations: card.skill.effect_dur,
                    values: card.skill.effect_val,
                },
            },
        },
        card.char_name,
    ])
}

function last(array) {
    return array[array.length - 1]
}
