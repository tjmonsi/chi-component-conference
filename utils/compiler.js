const fs = require('fs');
const configFile = '../configs/frontend.config.js';
const { resolve, relative } = require('path');
const checkDirectorySync = require('./check-directory');
const watch = process.argv.find(item => item === '--watch');
const dev = process.argv.find(item => item === '--dev');
const src = resolve(__dirname, '../src');
const target = resolve(__dirname, '../src/utils');
const dest = resolve(__dirname, '../public');

const fragmentBuild = () => {
  console.log('building fragments');
  const { fragments, routes } = require(configFile);
  const lazyLoad = [];
  routes.forEach(route => {
    lazyLoad.push(`'${route.route}': () => import('${relative(target, resolve(__dirname, '../', fragments[route.page]))}')`);
  });
  const string = `const fragments = {\n  ${lazyLoad.join(',\n  ')}\n};\nexport { fragments };`;
  checkDirectorySync(src);
  checkDirectorySync(target);
  fs.writeFileSync(resolve(target, 'fragments.js'), string.trim() + '\n', 'utf-8');
};

const firebaseBuild = () => {
  console.log('building firebase.json');
  const { routes } = require(configFile);
  const firebaseConfig = require('../firebase.json');
  const { hosting } = firebaseConfig;
  const rewrites = [];
  for (const route of routes) {
    if (route.route !== 'no-page') {
      const routeArray = route.route.split('/');
      const newRoute = routeArray.map(routePart => routePart.indexOf(':') === 0 ? '*' : routePart).join('/');
      if (route.route.indexOf('?') === route.route.length - 1) {
        route.route = route.route.replace('?', '');
        const routeArray = route.route.split('/');
        const subRoute = routeArray.slice(0, routeArray.length - 1).map(routePart => routePart.indexOf(':') === 0 ? '*' : routePart).join('/');
        rewrites.push({
          source: subRoute,
          destination: '/index.html'
        });
      }
      rewrites.push({
        source: newRoute,
        destination: '/index.html'
      });
    }
  }
  for (let host in hosting) {
    hosting[host].rewrites = rewrites;
  }
  fs.writeFileSync(resolve(__dirname, '../firebase.json'), JSON.stringify(firebaseConfig, null, 2));
};

const superStaticBuild = () => {
  console.log('building superstatic.json');
  const { routes } = require(configFile);
  const staticConfig = require('../superstatic.json');
  const rewrites = [];
  for (const route of routes) {
    if (route.route !== 'no-page') {
      const routeArray = route.route.split('/');
      const newRoute = routeArray.map(routePart => routePart.indexOf(':') === 0 ? '*' : routePart).join('/');
      if (route.route.indexOf('?') === route.route.length - 1) {
        route.route = route.route.replace('?', '');
        const routeArray = route.route.split('/');
        const subRoute = routeArray.slice(0, routeArray.length - 1).map(routePart => routePart.indexOf(':') === 0 ? '*' : routePart).join('/');
        rewrites.push({
          source: subRoute,
          destination: '/index.html'
        });
      }
      rewrites.push({
        source: newRoute,
        destination: '/index.html'
      });
    }
  }

  staticConfig.rewrites = rewrites;

  fs.writeFileSync(resolve(__dirname, '../superstatic.json'), JSON.stringify(staticConfig, null, 2));
};

const manifestBuild = () => {
  console.log('building manifest.json');
  const { app, theme } = require(configFile);
  const { title: name, shortName, startUrl, display, orientation, scope } = app;
  const { icons, themeColor, backgroundColor } = theme;
  const manifest = {
    name,
    short_name: shortName,
    icons,
    start_url: startUrl,
    background_color: backgroundColor,
    display,
    orientation,
    scope,
    theme_color: themeColor
  };
  checkDirectorySync(dest);
  fs.writeFileSync(resolve(dest, 'manifest.json'), JSON.stringify(manifest), 'utf8');
};

const prodBuild = () => {
  console.log('copy firebase');
  const file = fs.readFileSync(resolve(__dirname, '../', `configs/firebase/${!dev ? 'prod' : 'dev'}.config.js`), 'utf8');
  fs.writeFileSync(resolve(__dirname, '../', 'configs/firebase.config.js'), file, 'utf8');
};

const build = () => {
  fragmentBuild();
  superStaticBuild();
  firebaseBuild();
  manifestBuild();
  prodBuild();
};

build();
if (watch) fs.watch(resolve(__dirname, configFile), {}, build);
