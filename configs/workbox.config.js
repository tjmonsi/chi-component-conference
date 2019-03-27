const packages = require('./package.json');

module.exports = {
  cacheId: packages.name,
  globDirectory: 'public/',
  globPatterns: [
    '**/*.{html,json,js,css,map,svg,jpg,png,tff,woff,woff2}'
  ],
  swDest: 'public/service-worker.js',
  importWorkboxFrom: 'local',
  skipWaiting: true,
  clientsClaim: true,
  navigateFallback: '/index.html',
  navigateFallbackWhitelist: [/^(?!(\/__)|(\/service-worker\.js)|(\/_bundle-sizes\.html)|(\/_statistic\.html)|(\/_statistic\.json))/],
  // Define runtime caching rules.
  runtimeCaching: [
    {
      // Match any request ends with .png, .jpg, .jpeg or .svg.
      urlPattern: /\.(?:png|jpg|jpeg|svg)$/,

      // Apply a cache-first strategy.
      handler: 'cacheFirst',

      options: {
        cacheName: `${packages.name}-images`,
        expiration: {
          maxAgeSeconds: 31536000
        }
      }
    },
    {
      urlPattern: /^https:\/\/www.gstatic.com\/firebasejs\/.*/,
      handler: 'cacheFirst',
      options: {
        cacheName: `${packages.name}-firebase`,
        expiration: {
          maxAgeSeconds: 3600
        }
      }
    },
    {
      urlPattern: /^https:\/\/www.google-analytics.com\/analytics.js/,
      handler: 'networkFirst',
      options: {
        cacheName: `${packages.name}-analytics`,
        expiration: {
          maxAgeSeconds: 60
        }
      }
    }
  ]
};
