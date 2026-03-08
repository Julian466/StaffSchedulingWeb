import nextra from 'nextra'

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    output: 'export',
    basePath: '/StaffSchedulingWeb',
    images: {
        unoptimized: true // mandatory, otherwise won't export
    }
    // Optional: Change the output directory `out` -> `dist`
    // distDir: "build"
}
const withNextra = nextra({
    contentDirBasePath: '/docs',
})

export default withNextra(nextConfig)