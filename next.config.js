/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            "netcomlearning.s3.amazonaws.com",
            "images.netcomlearning.com",
            "img.youtube.com",
            "google.webp",
            "cdn.zeplin.io",
            "certs365.s3.amazonaws.com",
            "html.aicerts.io",
            "certs365-live.s3.amazonaws.com"
        ],
    },
    webpack: (config) => {
        config.module.rules.push({
            test: /pdf\.worker\.js$/,
            use: { loader: 'file-loader', options: { name: '[name].[ext]' } }
        });
        return config;
    },
}

module.exports = nextConfig
