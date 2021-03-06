const template = (html, self) => function () {
  const {
    sessionId,
    _baseUrl,
    showPublications,
    showVideo,
    copyLink,
    getVenueTitle,
    loading,
    session,
    _cleanText,
    _slugifyClass,
    dateString,
    dayString,
    timeString,
    _getDateTime,
    publications,
    _openPublications,
    forceShowPublications,
    _closeSession,
    openVideo,
    closeVideo
  } = this;

  // console.log(sessions, timeslot)
  return sessionId && session ? html`
    <div class="invi-anchor invi-anchor-session-${sessionId}"></div>
    ${loading ? html`
      <div class="loader-container">
        <img class="loader" src="${_baseUrl}assets/loader-2.gif">
      </div>
    ` : ''}

    ${_openPublications(showPublications, forceShowPublications) ? html`
      <h3 class="title big">
        <a class="pointer" @click="${_closeSession.bind(this)}">
          ${session && getVenueTitle(session.venue) ? html`
            ${getVenueTitle(session.venue)}:
          ` : ''}
          <marked-element .marked="${_cleanText(session.title)}"></marked-element>

          <a class="copy-anchor" title="Copy Link" @click="${copyLink.bind(this)}">
            <svg class="copy-icon">
              <title>Copy/Share Link</title>
              <path d="M10.59,13.41C11,13.8 11,14.44 10.59,14.83C10.2,15.22 9.56,15.22 9.17,14.83C7.22,12.88 7.22,9.71 9.17,7.76V7.76L12.71,4.22C14.66,2.27 17.83,2.27 19.78,4.22C21.73,6.17 21.73,9.34 19.78,11.29L18.29,12.78C18.3,11.96 18.17,11.14 17.89,10.36L18.36,9.88C19.54,8.71 19.54,6.81 18.36,5.64C17.19,4.46 15.29,4.46 14.12,5.64L10.59,9.17C9.41,10.34 9.41,12.24 10.59,13.41M13.41,9.17C13.8,8.78 14.44,8.78 14.83,9.17C16.78,11.12 16.78,14.29 14.83,16.24V16.24L11.29,19.78C9.34,21.73 6.17,21.73 4.22,19.78C2.27,17.83 2.27,14.66 4.22,12.71L5.71,11.22C5.7,12.04 5.83,12.86 6.11,13.65L5.64,14.12C4.46,15.29 4.46,17.19 5.64,18.36C6.81,19.54 8.71,19.54 9.88,18.36L13.41,14.83C14.59,13.66 14.59,11.76 13.41,10.59C13,10.2 13,9.56 13.41,9.17Z" />
            </svg>
          </a>

          ${session && session.youtubeId ? html`
            <a class="copy-anchor" title="Play Livestream" @click="${openVideo.bind(this)}">

              <img src="${_baseUrl}assets/livestream-icon.png" class="livestream-icon">
              <!-- <svg class="copy-icon">
                <path d="M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z" />
              </svg> -->
            </a>
          ` : ''}
        </a>
      </h3>
    ` : ''}

    ${!_openPublications(showPublications, forceShowPublications) ? html`
      <h3 class="title">
        ${session && getVenueTitle(session.venue) ? html`
          ${getVenueTitle(session.venue)}:
        ` : ''}

        <marked-element .marked="${_cleanText(session.title, 30)}"></marked-element>
      </h3>
    ` : ''}

    ${!_openPublications(showPublications, forceShowPublications) ? html`
      <p class="venue">
        ${session ? html`
          ${session.venue ? html`
            <img class="venue-icon" src="${_baseUrl}assets/${_slugifyClass(session.venue)}_black.svg">
          ` : ''}

          ${session.hasAward ? html`
            <img class="venue-icon-2" title="Session has Best Paper Award" alt="Session has Best Paper Award" src="${_baseUrl}assets/best.png">
          ` : ''}

          ${session.hasHonorableMention ? html`
            <img class="venue-icon-2" title="Session has Honorable Mention Award" alt="Session has Honorable Mention Award" src="${_baseUrl}assets/honorable.png">
          ` : ''}
        ` : ''}

        <chi-room class="chi-room-item" .roomId="${session.roomId}" .dayString="${dayString}" .venue="${session.venue}"></chi-room>
      </p>
    ` : html`
      <p class="venue">
        ${session.chair ? html`
          Chair:
          <marked-element .marked="${session.chair}"></marked-element><br>
        ` : ''}
        ${_getDateTime(dayString, dateString, timeString)}<br>

        <chi-room class="chi-room-item" .roomId="${session.roomId}" .dayString="${dayString}" .venue="${session.venue}"></chi-room>

      </p>

      <section class="publications">
        ${publications && publications.length ? publications.map(item => html`
          <chi-publication class="chi-publication-item" .publicationId="${item.$key}" .sessionId="${sessionId}"></chi-publication>
        `) : ''}
      </section>

    `}

    <dialog-box id="session-video" class="session-video">
      <button type="button" class="dialog-button" @click="${closeVideo.bind(this)}">
        <svg class="icon">
          <title>Close Video</title>
          <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
        </svg>
      </button>
      ${showVideo && session && session.youtubeId ? html`
        <iframe class="session-video-frame" src="https://www.youtube.com/embed/live_stream?enablejsapi=1&modestbranding=1&showinfo=0&color=white&channel=${session.youtubeId}" frameborder="0" allow="autoplay; encrypted-media"></iframe>
      ` : ''}
    </dialog-box>
  ` : '';
}.bind(self)();

export { template };

/*
 <!-- <a class="copy-anchor" title="Play Livestream" href="https://chi2018.acm.org/attending/stream/?timeslot=${timeslotRealId}&room=${session.roomName}" target="_blank" rel="noopener noreferrer"> -->
*/
