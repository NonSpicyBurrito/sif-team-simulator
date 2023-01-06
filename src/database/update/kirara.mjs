import { writeFileSync } from 'fs'
import fetch from 'node-fetch'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { prettify } from './utils.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))

const cardsPath = `${__dirname}/../../../public/database/cards.json`
const charactersPath = `${__dirname}/../../../public/database/characters.json`
const accessoriesPath = `${__dirname}/../../../public/database/accessories.json`

const cards = {}
const characters = {}
const accessories = {}

const cardIds = await getCardIds()
const cardIdChunks = split(cardIds, 1000)

for (const cardIds of cardIdChunks) {
    for (const [id, data, name] of await getCardsData(cardIds)) {
        cards[id] = data
        characters[data.character] = name
    }
}

const accessoryIds = await getAccessoryIds()
const accessoryIdChunks = split(accessoryIds, 1000)

for (const accessoryIds of accessoryIdChunks) {
    for (const [id, data] of await getAccessoriesData(accessoryIds)) {
        accessories[id] = data
    }
}

writeFileSync(cardsPath, prettify(cards))
writeFileSync(charactersPath, prettify(characters))
writeFileSync(accessoriesPath, prettify(accessories))

async function getCardIds() {
    return (
        await post('/ds/neo-search/cards/results.json', {
            rarity: [1],
            max_smile: {
                compare_type: 'gt',
                compare_to: 1,
            },
            _sort: '+ordinal',
        })
    ).result
}

async function getCardsData(ids) {
    const cards = (await get(`/v1/card/${ids.join(',')}.json`)).cards

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

async function getAccessoryIds() {
    return (await get('/v1/accessory_list.json')).accessories
        .filter((accessory) => accessory.is_valid)
        .map((accessory) => accessory.id)
}

async function getAccessoriesData(ids) {
    const accessories = (await get(`/v1/accessory/${ids.join(',')}.json`)).accessories

    return accessories
        .filter((accessory) => [4, 5].includes(accessory.rarity))
        .map((accessory) => [
            accessory.id,
            {
                character: accessory.unit_type_id || 0,
                stats: accessory.smile.map((_, i) => [
                    accessory.smile[i],
                    accessory.pure[i],
                    accessory.cool[i],
                ]),
                skill: {
                    trigger: {
                        chances: accessory.probability,
                        values: accessory.trigger_val.map((value) => value || 0),
                    },
                    effect: {
                        type: accessory.effect_type,
                        durations: accessory.effect_dur,
                        values: accessory.effect_val,
                    },
                },
            },
            accessory.char_name,
        ])
}

async function get(url) {
    const response = await fetch(`https://sif.kirara.ca/api${url}`)
    return await response.json()
}

async function post(url, data) {
    const response = await fetch(`https://sif.kirara.ca/api${url}`, {
        method: 'POST',
        body: JSON.stringify(data),
    })
    return await response.json()
}

function split(array, size) {
    return [...Array(Math.ceil(array.length / size))].map((_, i) =>
        array.slice(i * size, i * size + size)
    )
}

function last(array) {
    return array[array.length - 1]
}
