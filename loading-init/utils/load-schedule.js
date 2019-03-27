const getExistingKey = require('./get-existing-key');
const loadTimeslot = require('./load-timeslot');

module.exports = async (admin, config, scheduleList, conferenceId) => {
  console.log('loading Schedule...');
  const db = admin.database();
  const updates = {};
  const schedules = [];

  for (let schedule of scheduleList) {
    let scheduleId = await db.ref(config.dataPath(config.schedule)).orderByChild('conferenceScheduleId').equalTo(conferenceId + '::' + schedule.date).once('value').then(getExistingKey);
    scheduleId = scheduleId || db.ref(config.dataPath(config.schedule)).push().key;
    const data = {
      conferenceScheduleId: conferenceId + '::' + schedule.date,
      dayString: schedule.day,
      dateString: schedule.date,
      processed: false,
      index: scheduleList.indexOf(schedule),
      conferenceId
    };
    updates[config.dataPath(config.schedule, scheduleId)] = data;
    schedules.push({ scheduleId, slots: schedule.slots });
  }

  console.log('Updating schedule');
  await db.ref().update(updates);

  for (let { scheduleId, slots } of schedules) {
    await loadTimeslot(admin, config, slots, conferenceId, scheduleId);
    console.log(`Timeslot done for ${scheduleId}`);
  }
};
