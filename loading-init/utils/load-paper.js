const getExistingKey = require('./get-existing-key');
const loadAuthor = require('./load-author');

module.exports = async (admin, config, paperList, conf, conferenceId) => {
  console.log('loading Papers...');
  const db = admin.database();
  const updates = {};
  const updates2 = {};
  const publications = [];

  for (let paper of paperList) {
    console.log('index:', paperList.indexOf(paper));

    let publicationId = paper.id;
    // console.log(paper)
    await loadAuthor(admin, config, paper.authors, conf, conferenceId, publicationId, updates, publications);

    const data = {
      title: paper.title,
      abstract: paper.abstract,
      conferencePublicationId: conferenceId + '::' + paper.id,
      acmLink: paper.acmLink,
      shortText: paper.cbStatement || '',
      venue: paper.venue,
      subtype: paper.subtype.toLowerCase(),
      award: paper.award,
      hm: paper.hm,
      processed: false,
      conferenceId
    };
    updates[config.dataPath(config.publication, publicationId)] = data;
    // console.log(updates)
  }

  console.log('Updating publications');
  await db.ref().update(updates);

  for (let { publicationId, rank, authorId } of publications) {
    updates2[config.dataPath(config.author, authorId) + `publications/${publicationId}/value`] = true;
    updates2[config.dataPath(config.publication, publicationId) + `authors/${authorId}/value`] = rank;
  }

  console.log('Updating author paper connection');
  await db.ref().update(updates2);
};
