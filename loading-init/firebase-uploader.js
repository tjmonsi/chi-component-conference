const admin = require('./utils/admin');
const config = require('../configs/init.config');
const { conf } = config;
// const authors = require('./files/authors.json');
const papers = require('./files/papers.json');
const sessions = require('./files/sessions.json');
const schedule = require('./files/schedule.json');
const setConference = require('./utils/set-conference');
const loadPaper = require('./utils/load-paper');
const loadSession = require('./utils/load-session');
const loadSchedule = require('./utils/load-schedule');

const paperList = [];
const sessionList = [];

for (let i in papers) {
  var paperObj = papers[i];
  paperObj.id = i;
  paperList.push(paperObj);
}

for (let j in sessions) {
  var sessionObj = sessions[j];
  sessionObj.id = j;
  sessionList.push(sessionObj);
}

const init = async () => {
  // console.log(authors[0])
  // console.log(Object.keys(papers).length)
  // console.log(Object.keys(sessions).length)
  // console.log(schedule.length)

  const conferenceId = await setConference(admin, config, { shortId: conf });
  await loadPaper(admin, config, paperList, conf, conferenceId);
  await loadSession(admin, config, sessionList, conf, conferenceId);
  await loadSchedule(admin, config, schedule, conferenceId);
  console.log(conferenceId);
};

init().then(() => {
  console.log('done');
  process.exit(0);
});
