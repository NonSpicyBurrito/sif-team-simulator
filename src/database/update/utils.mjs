export function extract(text, start, end, from) {
    const fromIndex = from ? text.indexOf(from) : 0
    const startIndex = text.indexOf(start, fromIndex) + start.length
    const endIndex = text.indexOf(end, startIndex)

    return text.slice(startIndex, endIndex)
}
