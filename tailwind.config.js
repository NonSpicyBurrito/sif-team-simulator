module.exports = {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontSize: {
                xxs: '0.5rem',
            },
        },
    },
    plugins: [require('@tailwindcss/forms')],
}
