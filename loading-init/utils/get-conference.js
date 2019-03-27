const getExistingKey = require('./get-existing-key');

module.exports = (...args) => {
  console.log('start getting conference');
  const [admin, config, conference] = args;
  return admin.database().ref(config.dataPath('conference')).orderByChild('shortId').equalTo(conference.shortId).once('value').then(getExistingKey);
};
