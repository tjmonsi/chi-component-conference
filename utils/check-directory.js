const { statSync, mkdirSync } = require('fs');

const checkDirectorySync = (directory) => {
  try {
    statSync(directory);
  } catch (e) {
    mkdirSync(directory);
  }
};

module.exports = checkDirectorySync;
