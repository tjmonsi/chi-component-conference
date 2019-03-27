const checkDirectory = require('./check-directory');
const { resolve } = require('path');
const dest = resolve(__dirname, '../public');

checkDirectory(dest);
