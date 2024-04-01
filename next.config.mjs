/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
    trailingSlash: true,
    images: {
        unoptimized: true
    }
};

export default nextConfig;
