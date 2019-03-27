const app = {
  title: 'CHI Conference Component',
  shortName: 'CHI Conference Component', // 12 characters max
  description: 'CHI Conference Component',
  sentry: '',
  baseHref: '/',
  startUrl: '/',
  display: 'standalone',
  orientation: 'any',
  scope: '/',
  twitter: '@tjmonsi',
  twitterCreator: '@tjmonsi',
  image: ''
};

const theme = {
  themeColor: '#000',
  backgroundColor: '#000',
  favicon: '/assets/favicon.ico',
  webApp: {
    capable: 'yes',
    statusBarStyle: 'black-translucent',
    tapHighlight: 'no'
  },
  icons: []
};

const fragments = {};

const routes = [];

const puppeteer = {
  launch: {
    headless: true,
    slowMo: 100
  }
};

module.exports = { app, theme, fragments, routes, puppeteer };
