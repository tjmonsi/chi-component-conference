const version = 'v1';
const conf = 'chi2019';
const config = {
  version,
  conf,
  publication: 'publication',
  user: 'user',
  author: 'author',
  chair: 'chair',
  conference: 'conference',
  journal: 'journal',
  session: 'session',
  schedule: 'schedule',
  timeslot: 'timeslot',
  room: 'room',
  showChair: true,
  dataPath: (model, key) => {
    const path = `${version}/${model}-model/${model}/`;
    return key ? path + key + '/' : path;
  },
  listPath: (model, list, key) => {
    const path = `${version}/${model}-model/list/${list}/`;
    return key ? path + key + '/' : path;
  }
};

module.exports = config;
