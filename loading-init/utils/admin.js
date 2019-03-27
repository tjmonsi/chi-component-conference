const admin = require('firebase-admin');
const serviceAccount = require('../../configs/server/dev.server.config.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://conference-schedule-system.firebaseio.com'
});

module.exports = admin;
