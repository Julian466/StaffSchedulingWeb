import nextra from 'nextra'
import { fileURLToPath } from 'url'
import path from 'path'

/**
 * @type {import('next').NextConfig}
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const nextConfig = {
    output: 'export',
    basePath: '/StaffSchedulingWeb',
    images: {
        unoptimized: true // mandatory, otherwise won't export
    },
    turbopack: {
        root: __dirname,  // ← verhindert, dass Turbopack das Repo-Root nimmt
    },
    // Optional: Change the output directory `out` -> `dist`
    // distDir: "build"
}
const withNextra = nextra({
    contentDirBasePath: '/docs',
})

export default withNextra(nextConfig)