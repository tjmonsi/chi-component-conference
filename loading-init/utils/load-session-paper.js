module.exports = async (admin, config, submissionList, conferenceId, sessionId) => {
  console.log('loading papers for ' + sessionId);
  const db = admin.database();
  const updates = {};

  for (let submissionId of submissionList) {
    const publicationId = submissionId;
    if (publicationId) {
      updates[config.dataPath(config.publication, publicationId) + 'sessionId'] = sessionId;
      updates[config.dataPath(config.session, sessionId) + `publications/${publicationId}/value`] = submissionList.indexOf(submissionId);
    }
  }

  await db.ref().update(updates);
};
