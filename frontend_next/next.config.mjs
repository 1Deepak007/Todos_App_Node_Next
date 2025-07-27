// frontend_next/next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
    // This is where you would add any Next.js-specific configurations.
    // For example, if you later want to optimize images from external sources,
    // enable strict mode, or configure Webpack:
    //
    // reactStrictMode: true, // Enables React's Strict Mode for development
    //
    // images: {
    //   remotePatterns: [ // For allowing images from specific external domains
    //     {
    //       protocol: 'https',
    //       hostname: 'res.cloudinary.com', // Example: your Cloudinary domain
    //       port: '',
    //       pathname: '/your-cloud-name/**', // Example: your Cloudinary path
    //     },
    //   ],
    // },
    //
    // webpack: (config, { isServer }) => { // For custom Webpack configurations
    //   // Example: Modify config
    //   return config;
    // },
};

export default nextConfig; // This line is crucial for .mjs files