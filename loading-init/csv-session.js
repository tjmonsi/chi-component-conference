const sessionData = require('./files/sessions.json');
const schedule = require('./files/schedule.json');
const stringify = require('csv-stringify');
const fs = require('fs');

const list = [
  ['Date', 'Day', 'Time', 'Session', 'Room', 'Type']
];
const json = [];

const cleanTime = time => time.split(' - ').map(t => t.split(':').splice(0, 2).join(':')).join(' - ');

for (const day of schedule) {
  const { slots, date, day: dayName } = day;
  const obj = {
    date,
    day: dayName,
    timeslots: []
  };

  for (const slot of slots) {
    const { sessions, time } = slot;
    const timeslot = {
      time: cleanTime(time),
      sessions: []
    };
    for (const session of sessions) {
      const sessionName = sessionData[session.session].s_title.replace(/&nbsp;/g, ' ');
      timeslot.sessions.push({
        room: session.room,
        session: sessionName,
        type: session.type
      });
      list.push([date, dayName, cleanTime(time), sessionName, session.room, session.type]);
    }

    obj.timeslots.push(timeslot);
  }
  json.push(obj);
}

stringify(list, function (err, output) {
  if (err) {
    throw err;
  }
  fs.writeFileSync('./files/sessions.csv', output, 'utf8');
  fs.writeFileSync('./files/session-glance.json', JSON.stringify(json, null, 2), 'utf8');
  process.exit(0);
});
