const template = (html, self) => function () {
  const {
    sessions,
    timeslot,
    timeslotId,
    scheduleIndex,
    dayString,
    dateString,
    showTimeslot,
    forceOpen,
    _showSummary,
    _timeslotColorClass,
    _toggleTimeslot,
    _collapseAll,
    _showAll,
    _duplicate,
    _closeDuplicate,
    _getTimeslotRealId
  } = this;

  // console.log(sessions, timeslot)
  return sessions ? html`
    <div class="invi-anchor invi-anchor-timeslot-${timeslotId}"></div>
    ${sessions.length ? html`
      <header class="header">
        <div class="${_timeslotColorClass(scheduleIndex)}-timeslot timeslot timeslot-time" @click="${_toggleTimeslot.bind(this)}">
          <h2 class="time" @click="${_toggleTimeslot.bind(this)}">
            ${timeslot.time.split('-').map(item => item.trim().split(':').splice(0, 2).join(':')).join(' - ')}
          </h2>
        </div>
        <div class="${_timeslotColorClass(scheduleIndex)}-timeslot timeslot timeslot-name">
          <h2 class="time time-flex">
            <a class="header-anchor time-anchor" @click="${_toggleTimeslot.bind(this)}">${timeslot.name}</a>
            ${showTimeslot ? html`
              ${forceOpen ? html`
                <a class="header-anchor-icon" @click="${_showSummary.bind(this)}">
                  <svg class="header-icon">
                    <title>Show Summary</title>
                    <path d="M16,20H20V16H16M16,14H20V10H16M10,8H14V4H10M16,8H20V4H16M10,14H14V10H10M4,14H8V10H4M4,20H8V16H4M10,20H14V16H10M4,8H8V4H4V8Z" />
                  </svg>
                </a>

                <a class="header-anchor-icon" @click="${_collapseAll.bind(this)}">
                  <svg class="header-icon">
                    <title>Collapse</title>
                    <path d="M19.78,11.78L18.36,13.19L12,6.83L5.64,13.19L4.22,11.78L12,4L19.78,11.78Z" />
                  </svg>
                </a>
              ` : html`
                <a class="header-anchor-icon" @click="${_collapseAll.bind(this)}">
                  <svg class="header-icon">
                    <title>Collapse</title>
                    <path d="M19.78,11.78L18.36,13.19L12,6.83L5.64,13.19L4.22,11.78L12,4L19.78,11.78Z" />
                  </svg>
                </a>
                <a class="header-anchor-icon" @click="${_showAll.bind(this)}">
                  <svg class="header-icon">
                    <title>Show All</title>
                    <path d="M5,2H19A1,1 0 0,1 20,3V13A1,1 0 0,1 19,14H5A1,1 0 0,1 4,13V3A1,1 0 0,1 5,2M6,4V12H18V4H6M20,17A1,1 0 0,1 19,18H5A1,1 0 0,1 4,17V16H20V17M20,21A1,1 0 0,1 19,22H5A1,1 0 0,1 4,21V20H20V21Z" />
                  </svg>
                </a>
              `}
            ` : html`
              <a class="header-anchor-icon" @click="${_showSummary.bind(this)}">
                <svg class="header-icon">
                  <title>Show Summary</title>
                  <path d="M16,20H20V16H16M16,14H20V10H16M10,8H14V4H10M16,8H20V4H16M10,14H14V10H10M4,14H8V10H4M4,20H8V16H4M10,20H14V16H10M4,8H8V4H4V8Z" />
                </svg>
              </a>
              <a class="header-anchor-icon" @click="${_showAll.bind(this)}">
                <svg class="header-icon">
                  <title>Show All</title>
                  <path d="M5,2H19A1,1 0 0,1 20,3V13A1,1 0 0,1 19,14H5A1,1 0 0,1 4,13V3A1,1 0 0,1 5,2M6,4V12H18V4H6M20,17A1,1 0 0,1 19,18H5A1,1 0 0,1 4,17V16H20V17M20,21A1,1 0 0,1 19,22H5A1,1 0 0,1 4,21V20H20V21Z" />
                </svg>
              </a>
            `}
          </h2>
        </div>
      </header>

      ${showTimeslot ? html`
        <section class="grid ${_timeslotColorClass(scheduleIndex)}-border">
          <!-- <div class="sessions"> -->
            ${sessions && sessions.length && sessions.map((item, index) => html`

              <chi-session .sessionId="${item.$key}" .index=${index} class="chi-session-item ${_timeslotColorClass(scheduleIndex)}-item" .timeslotId="${timeslotId}" ?force-close="${item.forceClose}" ?show-publications="${item.showPublications}" .targetEl="${item.targetEl}" @open-duplicate="${_duplicate.bind(this)}" @close-duplicate="${_closeDuplicate.bind(this)}" .dayString="${dayString}" .dateString="${dateString}" .timeString="${timeslot.time}" .timeslotRealId="${_getTimeslotRealId(timeslot.conferenceTimeslotId)}">
            </chi-session>
            `)}
          <!-- </div> -->
        </section>
      ` : ''}
    ` : ''}
  ` : '';
}.bind(self)();

export { template };
