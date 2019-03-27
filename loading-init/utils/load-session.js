// const getExistingKey = require('./get-existing-key');
// const loadSessionPaper = require('./load-session-paper');

module.exports = async (admin, config, sessionList, conf, conferenceId) => {
  console.log('loading Sessions...');
  const db = admin.database();
  let updates = {};
  const sessions = [];

  for (let session of sessionList) {
    let sessionId = session.id;

    const data = {
      title: session.s_title,
      venue: session.venue,
      type: session.type,
      subtype: session.subtype,
      hasAward: session.hasAward,
      roomName: session.room,
      hasHonorableMention: session.hasHonorableMention,
      conferenceSessionId: conferenceId + '::' + session.id,
      time: session.time,
      date: session.day,
      processed: false,
      chair: session.chair,
      chairId: session.chairId,
      showChair: config.showChair,
      conferenceId
    };
    updates[config.dataPath(config.session, sessionId)] = data;
    sessions.push({ sessionId, submissions: session.submissions });
  }

  await db.ref().update(updates);

  updates = {};

  for (let { sessionId, submissions } of sessions) {
    for (let submissionId of submissions) {
      const publicationId = submissionId;
      if (publicationId) {
        updates[config.dataPath(config.publication, publicationId) + 'sessionId'] = sessionId;
        updates[config.dataPath(config.session, sessionId) + `publications/${publicationId}/value`] = submissions.indexOf(submissionId);
      }
    }
  }

  console.log('Updating session');

  await db.ref().update(updates);
};
