import nextra from 'nextra'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
/**
 * @type {import('next').NextConfig}
 */

const isGithubActions = process.env.GITHUB_ACTIONS === 'true'

const nextConfigLocal = {
    output: 'export',
    images: {
        unoptimized: true // mandatory, otherwise won't export
    },
}

const nextConfigGithubActions = {
    basePath: '/StaffSchedulingWeb',
    output: 'export',
    images: {
        unoptimized: true // mandatory, otherwise won't export
    },
    turbopack: {
        // Optional: Disable Turbopack for development
        // dev: false,
        root: __dirname,
    },
    // Optional: Change the output directory `out` -> `dist`
    // distDir: "build"
}

const withNextra = nextra({
    // ... other Nextra config options
})

export default withNextra(isGithubActions ? nextConfigGithubActions : nextConfigLocal)