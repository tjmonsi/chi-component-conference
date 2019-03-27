const template = (html, self) => function () {
  const {
    loading,
    scheduleArray,
    _baseUrl
  } = this;

  return html`
    ${loading ? html`
      <div style="max-width: 1170px;margin: 20px auto;padding: 20px; padding: 80px 20px; text-align: center">
      <img src="${_baseUrl}/program/loader.gif">
      <br/><span class="loading-screen-text">Loading the Schedule...</span>
    </div>
    ` : html`
      ${scheduleArray ? scheduleArray.map((item, index) => html`
        <chi-day class="chi-day-item" .scheduleObj=${item} schedule-index="${index}"></chi-day>
      `) : ''}
    `}
  `;
}.bind(self)();

export { template };
