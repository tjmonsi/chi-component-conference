const admin = require('./utils/admin');
const config = require('../configs/init.config');
const { conf } = config;
const getConference = require('./utils/get-conference');
const algoliasearch = require('algoliasearch');
const algoliaConfig = require('../configs/algolia.config.json');
const client = algoliasearch(algoliaConfig.key, algoliaConfig.secret);
console.log(conf);
const index = client.initIndex(`chi-index-${conf}`);
const db = admin.database();

const init = async () => {
  index.setSettings({
    searchableAttributes: ['title', 'displayName', 'email', 'firstName', 'lastName', 'primary.institution,primary.dept', 'primary.city,primary.country', 'secondary.institution,secondary.dept', 'secondary.city,secondary.country', 'chair', 'abstract,shortText', 'venue'],
    attributesForFaceting: ['searchType', 'conferenceId', 'award', 'hm', 'hasAward', 'hasHonorableMention']
  });

  try {
    const conferenceId = await getConference(admin, config, { shortId: conf });
    const authorsSnapshot = await db.ref(config.dataPath(config.author)).once('value');
    const papersSnapshot = await db.ref(config.dataPath(config.publication)).orderByChild('conferenceId').equalTo(conferenceId).once('value');
    const sessionsSnapshot = await db.ref(config.dataPath(config.session)).orderByChild('conferenceId').equalTo(conferenceId).once('value');
    const authors = [];
    const papers = [];
    const sessions = [];
    authorsSnapshot.forEach(authorSnap => {
      authors.push(Object.assign({}, authorSnap.val(), { objectID: authorSnap.key, searchType: 'author' }));
    });

    console.log('adding Authors on indexing');
    console.log(authors.length);
    let setAuthors = [];

    while (authors.length > 0) {
      setAuthors.push(authors.pop());
      // console.log(setAuthors.length)
      if (setAuthors.length === 2000) {
        console.log('uploading authors, ', authors.length);
        await index.addObjects(setAuthors);
        setAuthors = [];
      }
    }
    await index.addObjects(setAuthors);
    console.log('authors uploaded');

    papersSnapshot.forEach(paperSnap => {
      papers.push(Object.assign({}, paperSnap.val(), { objectID: paperSnap.key, searchType: 'publication' }));
    });
    console.log('adding Papers on indexing');
    await index.addObjects(papers);

    sessionsSnapshot.forEach(sessionSnap => {
      sessions.push(Object.assign({}, sessionSnap.val(), { objectID: sessionSnap.key, searchType: 'session' }));
    });
    console.log('adding Sessions on indexing');
    await index.addObjects(sessions);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

init().then(() => {
  console.log('done');
  process.exit(0);
});
