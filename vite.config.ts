import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

const branch = process.env.CF_PAGES_BRANCH || 'unknown'
const sha1 = process.env.CF_PAGES_COMMIT_SHA || 'unknown'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    define: {
        VITE_APP_BRANCH: JSON.stringify(branch),
        VITE_APP_SHA1: JSON.stringify(sha1),
    },
})
