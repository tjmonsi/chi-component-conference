// const async = require('async')
const getExistingKey = require('./get-existing-key');
const loadRoom = require('./load-room');

module.exports = async (admin, config, sessionList, conferenceId, scheduleId, timeslotId) => {
  console.log('loading sessions for ' + timeslotId);
  const db = admin.database();
  const updates = {};

  for (let session of sessionList) {
    const sessionId = await db.ref(config.dataPath(config.session)).orderByChild('conferenceSessionId').equalTo(conferenceId + '::' + session.session).once('value').then(getExistingKey);
    const sessionObj = await db.ref(config.dataPath(config.session, sessionId)).once('value').then(snapshot => snapshot.val());
    await loadRoom(admin, config, session.room, conferenceId, sessionId);
    if (sessionId) {
      updates[config.dataPath(config.session, sessionId) + 'timeslotId'] = timeslotId;
      updates[config.dataPath(config.session, sessionId) + 'scheduleId'] = scheduleId;
      updates[config.dataPath(config.timeslot, timeslotId) + `sessions/${sessionId}/value`] = sessionList.indexOf(session);
      updates[config.dataPath(config.timeslot, timeslotId) + `sessions/${sessionId}/title`] = sessionObj.title;
      updates[config.dataPath(config.timeslot, timeslotId) + `sessions/${sessionId}/room`] = session.room;
    }
  }

  await db.ref().update(updates);
};
