const cobiConfig = require('../configs/server/cobi.config.json');
const fs = require('fs');
const http = require('http');
const url = `http://cobi.cs.jmu.edu/export.php?user=${cobiConfig.user}&password=${encodeURI(cobiConfig.password)}&`;

const download = (name) => {
  const filename = `./files/${name}.json`;
  const file = fs.createWriteStream(filename);
  return new Promise((resolve, reject) => http.get(`${url}file=${name}`, (response) => {
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
