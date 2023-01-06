export const prettify = (data, indent = '') => {
    if (!data || typeof data !== 'object' || Array.isArray(data)) return JSON.stringify(data)

    return (
        `{\n${indent}  ` +
        Object.entries(data)
            .filter(([, v]) => v !== undefined)
            .map(([k, v]) => `"${k}": ${prettify(v, `  ${indent}`)}`)
            .join(`,\n${indent}  `) +
        `\n${indent}}`
    )
}
