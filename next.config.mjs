/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure pageExtensions to include md and mdx
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  // Optionally, add any other Next.js config below
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  redirects: async () => [{
    source: `/`,
    destination: `/posts/post-1`,
    permanent: false
  }]
}

export default nextConfig
