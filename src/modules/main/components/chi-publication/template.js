const template = (html, self) => function () {
  const {
    loading,
    publicationId,
    publication,
    _baseUrl,
    _hideAbstract,
    _toggleAbstract,
    _showAbstract,
    openVideo,
    closeVideo,
    copyLink,
    authors,
    showInformation,
    showVideo
  } = this;

  return html`
    <div class="invi-anchor invi-anchor-pub-${publicationId}"></div>
    ${loading ? html`
      <img class="loader" src="${_baseUrl}assets/loader-2.gif">
    ` : html`
      <h4 class="title">
        ${publication ? html`
          ${publication.hm ? html`
            <img class="icon img-icon" title="Honorable Mention" alt="Honorable Mention" src="${_baseUrl}assets/honorable.png">
          ` : ''}

          ${publication.award ? html`
            <img class="icon img-icon" title="Best Paper" alt="Best Paper" src="${_baseUrl}assets/best.png">
          ` : ''}

          <a class="anchor" @click="${_toggleAbstract.bind(this)}">
            <marked-element .marked="${publication.title}"></marked-element>
          </a>

          ${publication.acmLink ? html`
            <a class="anchor anchor-icon" title="ACM Link" href="${publication.acmLink}" target="_blank" rel="noopener noreferrer">
              <img class="icon" src="${_baseUrl}assets/acm.svg">
            </a>
          ` : ''}

          ${publication.youtubeId ? html`
            <a class="anchor anchor-icon" title="Video showcase" @click="${openVideo.bind(this)}">
              <img class="icon small" src="${_baseUrl}assets/videoshowcase_black.svg">
            </a>
          ` : ''}
        ` : ''}

        <a class="anchor anchor-icon" @click="${copyLink.bind(this)}">
          <svg class="icon align">
            <title>Copy/Share Link</title>
            <path d="M10.59,13.41C11,13.8 11,14.44 10.59,14.83C10.2,15.22 9.56,15.22 9.17,14.83C7.22,12.88 7.22,9.71 9.17,7.76V7.76L12.71,4.22C14.66,2.27 17.83,2.27 19.78,4.22C21.73,6.17 21.73,9.34 19.78,11.29L18.29,12.78C18.3,11.96 18.17,11.14 17.89,10.36L18.36,9.88C19.54,8.71 19.54,6.81 18.36,5.64C17.19,4.46 15.29,4.46 14.12,5.64L10.59,9.17C9.41,10.34 9.41,12.24 10.59,13.41M13.41,9.17C13.8,8.78 14.44,8.78 14.83,9.17C16.78,11.12 16.78,14.29 14.83,16.24V16.24L11.29,19.78C9.34,21.73 6.17,21.73 4.22,19.78C2.27,17.83 2.27,14.66 4.22,12.71L5.71,11.22C5.7,12.04 5.83,12.86 6.11,13.65L5.64,14.12C4.46,15.29 4.46,17.19 5.64,18.36C6.81,19.54 8.71,19.54 9.88,18.36L13.41,14.83C14.59,13.66 14.59,11.76 13.41,10.59C13,10.2 13,9.56 13.41,9.17Z" />
          </svg>
        </a>
      </h4>

      <section class="pub-body">
        <p>
          <ul class="authors">
            ${authors && authors.length ? authors.map(item => html`
              <li class="list-item">
                <chi-author .authorId="${item.$key}" .publicationId="${publicationId}"></chi-author>
              </li>
            `) : ''}
          </ul>
        </p>
        ${publication ? html`
          ${!showInformation ? html`
            ${publication.abstract ? html`
              <p>
                <a class="abstract-anchor" @click="${_showAbstract.bind(this)}">
                  Show Abstract
                </a>
              </p>
            ` : ''}
            <p>
              <marked-element .marked="${publication.shortText}"></marked-element>
            </p>
          ` : html`
            ${publication.shortText || publication.abstract ? html`
              <p>
                <a class="abstract-anchor" @click="${_hideAbstract.bind(this)}">
                  Hide Abstract
                </a>
              </p>
            ` : ''}
            <p>
              <marked-element .marked="${publication.abstract}"></marked-element>
            </p>
          `}
        ` : ''}
      </section>
    `}

    <dialog-box id="publication-video" class="publication-video">
      ${showVideo ? html`
        <button type="button" class="dialog-button" @click="${closeVideo.bind(this)}">
          <svg class="icon">
            <title>Close Session</title>
            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
          </svg>
        </button>
        ${publication && publication.youtubeId ? html`
          <iframe class="publication-video-frame" src="https://www.youtube.com/embed/${publication.youtubeId}" frameborder="0" allow="autoplay; encrypted-media"></iframe>
        ` : ''}
      ` : ''}
    </dialog-box>
  `;
}.bind(self)();

export { template };
