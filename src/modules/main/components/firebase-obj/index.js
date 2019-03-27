import firebase from 'firebase/app';
import 'firebase/database';
const conferenceId = 'chi2019';
const version = 'v1';
const config = {
  authDomain: 'conference-schedule-system.firebaseapp.com',
  databaseURL: 'https://conference-schedule-system.firebaseio.com'
};

firebase.initializeApp(config);
export { firebase, conferenceId, version };
