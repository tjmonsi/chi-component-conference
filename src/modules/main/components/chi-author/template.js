const template = (html, self) => function () {
  const {
    author,
    publicationId,
    getNameAndInstitution
  } = this;

  // console.log(this)

  return author ? html`
    <marked-element .marked="${getNameAndInstitution.bind(this)(`${author.firstName} ${author.lastName}`, author.primarySet, author.secondarySet, publicationId)}"></marked-element>
  ` : '';
}.bind(self)();

export { template };
