const cobiConfig = require('../configs/server/cobi.config.json');
const fs = require('fs');
const https = require('https');
// const url = ``;

const download = (name) => {
  const filename = `./files/${name}.json`;
  const file = fs.createWriteStream(filename);
  return new Promise((resolve, reject) => https.get(`https://fbr.me/data/raw/${name}.json?authKey=${cobiConfig.auth}`, (response) => {
    response.pipe(file);
    file.on('finish', function () {
      file.close(resolve); // close() is async, call cb after close completes.
    });
  }).on('error', (err) => { // Handle errors
    fs.unlink(filename); // Delete the file async. (But we don't check the result)
    reject(err);
  }));
};

const init = async () => {
  await download('authors');
  await download('papers');
  await download('sessions');
  await download('schedule');

  // console.log(result);
};

init().then(() => {
  console.log('done');
  process.exit(0);
});
