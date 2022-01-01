import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

const branch = process.env.CF_PAGES_BRANCH || 'unknown'
const sha1 = process.env.CF_PAGES_COMMIT_SHA || 'unknown'
const buildTime = Date.now()
const diagnostics = branch !== 'master'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    define: {
        VITE_APP_BRANCH: JSON.stringify(branch),
        VITE_APP_SHA1: JSON.stringify(sha1),
        VITE_APP_BUILD_TIME: JSON.stringify(buildTime),
        VITE_APP_DIAGNOSTICS: JSON.stringify(diagnostics),
    },
})
