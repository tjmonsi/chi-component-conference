const slugify = require('slugify');
const getExistingKey = require('./get-existing-key');
const loadTimeslotSession = require('./load-timeslot-session');

module.exports = async (admin, config, timeslotList, conferenceId, scheduleId) => {
  console.log('loading timeslot for ' + scheduleId);
  const db = admin.database();
  const updates = {};
  const timeslots = [];

  for (let timeslot of timeslotList) {
    let timeslotId = await db.ref(config.dataPath(config.timeslot)).orderByChild('conferenceTimeslotId').equalTo(conferenceId + '::' + timeslot.slot_id).once('value').then(getExistingKey);
    timeslotId = timeslotId || db.ref(config.dataPath(config.timeslot)).push().key;
    const data = {
      conferenceTimeslotId: conferenceId + '::' + timeslot.slot_id,
      slotId: timeslot.slot_id,
      time: timeslot.time,
      className: slugify(timeslot.slot_class).toLowerCase(),
      name: timeslot.slot_class,
      processed: false,
      scheduleId,
      conferenceId
    };

    updates[config.dataPath(config.timeslot, timeslotId)] = data;
    updates[config.dataPath(config.schedule, scheduleId) + `timeslots/${timeslotId}/value`] = timeslotList.indexOf(timeslot);
    timeslots.push({ sessions: timeslot.sessions, timeslotId });
  }

  console.log('Updating timeslot');
  await db.ref().update(updates);

  for (let { sessions, timeslotId } of timeslots) {
    await loadTimeslotSession(admin, config, sessions, conferenceId, scheduleId, timeslotId);
    console.log(`Finished setting sessions in timeslot: ${timeslotId}`);
  }
};
