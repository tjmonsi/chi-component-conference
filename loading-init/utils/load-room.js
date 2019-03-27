const getExistingKey = require('./get-existing-key');

module.exports = async (admin, config, conferenceRoomId, conferenceId, sessionId) => {
  console.log('loading room for ' + sessionId);
  const db = admin.database();
  const updates = {};

  let roomId = await db.ref(config.dataPath(config.room)).orderByChild('conferenceRoomId').equalTo(conferenceId + '::' + conferenceRoomId).once('value').then(getExistingKey);
  roomId = roomId || db.ref(config.dataPath(config.room)).push().key;

  const data = {
    conferenceRoomId: conferenceId + '::' + conferenceRoomId,
    room: conferenceRoomId,
    processed: false,
    conferenceId
  };

  updates[config.dataPath(config.room, roomId)] = data;
  updates[config.dataPath(config.session, sessionId) + 'roomId'] = roomId;

  await db.ref().update(updates);
};
