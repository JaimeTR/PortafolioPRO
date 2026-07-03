const withMDX = require('@next/mdx')()
/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'jaimetr.dev',
                port: '',
                pathname: '/storage/**',
            },
            {
                protocol: 'http',
                hostname: 'jaimetr.dev',
                port: '',
                pathname: '/storage/**',
            },
            {
                protocol: 'https',
                hostname: 'epmdauwektgtwujsisdh.supabase.co',
                port: '',
                pathname: '/storage/**',
            },
        ],
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on'
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN'
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'origin-when-cross-origin'
                    },
                ],
            },
        ]
    },
}

module.exports = withMDX(nextConfig)
