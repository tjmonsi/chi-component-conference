module.exports = async (admin, config, authorList, conf, conferenceId, publicationId, updates, authors) => {
  console.log('loading authors for ' + publicationId);
  // console.log(authorList)

  for (let author of authorList) {
    let authorId = author.authorId;

    const data = {
      authorId: author.authorId,
      email: author.email || '',
      firstName: author.givenName || author.firstName || '',
      middleInitial: author.middleInitial || author.middleName || '',
      lastName: author.familyName || author.lastName || '',
      displayName: author.name || (author.givenName || author.firstName) + ' ' + (author.familyName || author.lastName),
      primary: typeof author.primary === 'string' && author.primary ? JSON.parse(author.primary) : author.primary,
      secondary: typeof author.secondary === 'string' && author.secondary ? JSON.parse(author.secondary) : author.secondary,
      processed: false
    };

    const primary = typeof author.primary === 'string' && author.primary ? JSON.parse(author.primary) : author.primary;
    const secondary = typeof author.secondary === 'string' && author.secondary ? JSON.parse(author.secondary) : author.secondary;

    updates[config.dataPath(config.author, authorId) + '/authorId'] = data.authorId;
    updates[config.dataPath(config.author, authorId) + '/firstName'] = data.firstName;
    updates[config.dataPath(config.author, authorId) + '/middleInitial'] = data.middleInitial;
    updates[config.dataPath(config.author, authorId) + '/lastName'] = data.lastName;
    updates[config.dataPath(config.author, authorId) + '/displayName'] = data.displayName;

    updates[config.dataPath(config.author, authorId) + '/primary/'] = primary;
    updates[config.dataPath(config.author, authorId) + '/secondary/'] = secondary;
    authors.push({ authorId, rank: author.rank, publicationId });
  }
};
