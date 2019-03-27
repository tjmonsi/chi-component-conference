const fs = require('fs');
const { resolve } = require('path');
const pkg = require('../package.json');
const { version } = pkg;

const index = fs.readFileSync(resolve(__dirname, '../public/index.html'), 'utf8');
const moduleCore = fs.readFileSync(resolve(__dirname, `../public/module.core.${version}.js`), 'utf8');
if (index.search(`<script type="module">window.addEventListener`) < 0) {
  const newindex = index.replace('</body>', `<script type="module">window.addEventListener('window-core-start', function () {${moduleCore}})</script></body>`);
  fs.writeFileSync(resolve(__dirname, '../public/index.html'), newindex, 'utf8');
  fs.writeFileSync(resolve(__dirname, '../public/404.html'), newindex, 'utf8');
} else {
  console.log('Injection is already done');
}

console.log('Injection Done');
