const template = (html, self) => function () {
  const {
    day,
    forceShowSessions,
    timeslots,
    scheduleIndex,
    _getDateString,
    _openSlots,
    _closeSlots
  } = this;

  return day ? html`
    <div class="invi-anchor invi-anchor-day-${day.$key}"></div>
    <h1 class="day ${day.$key}-day">
      ${day.dayString} - ${_getDateString(day.dateString)}
      ${forceShowSessions ? html`
        <svg class="header-icon" @click="${_closeSlots.bind(this)}">
          <title>Collapse</title>
          <path d="M19.78,11.78L18.36,13.19L12,6.83L5.64,13.19L4.22,11.78L12,4L19.78,11.78Z" />
        </svg>
      ` : html`
        <svg class="header-icon" @click="${_openSlots.bind(this)}">
          <title>Show All</title>
          <path d="M5,2H19A1,1 0 0,1 20,3V13A1,1 0 0,1 19,14H5A1,1 0 0,1 4,13V3A1,1 0 0,1 5,2M6,4V12H18V4H6M20,17A1,1 0 0,1 19,18H5A1,1 0 0,1 4,17V16H20V17M20,21A1,1 0 0,1 19,22H5A1,1 0 0,1 4,21V20H20V21Z" />
        </svg>
      `}
    </h1>
    ${timeslots && timeslots.length ? timeslots.map(item => html`
      <chi-timeslot class="chi-timeslot-item" .timeslotId="${item.$key}" .scheduleIndex="${scheduleIndex}" .dayString="${day.dayString}" .dateString="${_getDateString(day.dateString)}" ?hidden=${item.hidden}></chi-timeslot>
    `) : ''}
  ` : '';
}.bind(self)();

export { template };
