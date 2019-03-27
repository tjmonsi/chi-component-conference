const getExistingKey = require('./get-existing-key');

module.exports = async (...args) => {
  console.log('start setting conference');
  const [admin, config, conference] = args;
  let key = await admin.database().ref(config.dataPath('conference')).orderByChild('shortId').equalTo(conference.shortId).once('value').then(getExistingKey);
  key = key || conference.shortId;
  await admin.database().ref(config.dataPath(config.conference, key)).set(conference);
  console.log(key);
  return key;
};
